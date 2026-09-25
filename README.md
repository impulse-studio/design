# design

Éditeur de maquettes React / TypeScript avec shadcn/ui (Base UI) et TanStack Start. Les frames sont rendues par React dans une iframe ; le shell de communication reste en Vue. La sync génère `@digit-ai-studio/digicomponents-react` depuis les rendus SSR de la bibliothèque Orchestration et copie ses styles. Le studio est disponible sur [localhost:3402](http://localhost:3402), le catalogue React sur [/design-system](http://localhost:3402/design-system).

## Démarrer

```bash
pnpm install
cp .env.example .env
docker compose up -d postgres
pnpm db:migrate
pnpm auth:seed-dev
pnpm dev
```

Avant le premier démarrage, renseigner `BETTER_AUTH_SECRET` et `DEV_AUTH_PASSWORD` dans `.env` avec deux valeurs générées par `openssl rand -base64 32`. En local, le bouton **Entrer avec le compte de dev** connecte `dev@digitevent.com`, propriétaire de l’équipe **Digitevent · Développement**. Google n’est pas nécessaire. Le seed est idempotent et rattache les anciennes maquettes locales sans équipe à cette équipe.

Le studio `/` liste et crée les maquettes de l’équipe active ; `/m/$mockupId` ouvre leur éditeur. Chaque nouvelle maquette contient une frame Desktop vide de 1440 × 900. `pnpm dev` construit le renderer puis le surveille pendant le développement du studio. Le catalogue et les maquettes nécessitent une session.

`pnpm sync:digicomponents --orchestration ../orchestration` prépare les sorties Digi dans un dossier temporaire et vérifie ensemble le manifest, les snapshots et les exports. Le processus lancé par `pnpm dev` se suspend pendant la publication puis redémarre une seule fois. Une publication interrompue est restaurée au prochain démarrage ou à la prochaine synchronisation. Les tests de ce mécanisme se lancent avec `node --test scripts/libraries/sync-publication.test.mjs` ; une régénération réelle nécessite le checkout Orchestration.

## Comptes, équipes et permissions

Better Auth gère les comptes, sessions et organisations. Dans l’interface, une organisation correspond à une **équipe**. `/teams` permet de créer et choisir une équipe, la renommer, inviter des membres, changer leurs rôles, les retirer et quitter une équipe. Les invitations sont réservées à `@digitevent.com`, expirent après 7 jours et apparaissent à leur destinataire après connexion. Aucun email n’est envoyé automatiquement.

| Rôle           | Maquettes                  | Membres                                        | Équipe                                  |
| -------------- | -------------------------- | ---------------------------------------------- | --------------------------------------- |
| Propriétaire   | Lecture, création, édition | Invitations, retrait, tous les rôles           | Renommer, nommer d’autres propriétaires |
| Administrateur | Lecture, création, édition | Invitations, retrait, rôles hors propriétaires | Renommer                                |
| Éditeur        | Lecture, création, édition | Consultation                                   | Consultation                            |
| Lecteur        | Lecture et Dev Mode        | Consultation                                   | Consultation                            |

Le dernier propriétaire ne peut pas quitter son équipe ni perdre son rôle. Les maquettes sont filtrées par appartenance à l’équipe à chaque lecture et écriture serveur. Un changement de rôle ou un retrait s’applique aux requêtes suivantes, même si une page est déjà ouverte. Les lecteurs restent en inspection et n’activent pas l’autosauvegarde.

Le mode de développement exige `AUTH_DEV_MODE=true`, `NODE_ENV=development`, une URL locale et une base locale. Il est désactivé en production, même si le drapeau est resté activé. Le mot de passe de développement reste côté serveur ; il n’est pas envoyé au navigateur.

### Connexion Google en production

Configurer `AUTH_DEV_MODE=false`, `BETTER_AUTH_URL=https://votre-studio`, un `BETTER_AUTH_SECRET` aléatoire propre à la production, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` et `DATABASE_URL`. Appliquer `pnpm db:migrate` avant le démarrage. Créer un client OAuth Google de type application Web et autoriser exactement `https://votre-studio/api/auth/callback/google`. Pour tester Google en local, désactiver `AUTH_DEV_MODE` et autoriser `http://localhost:3402/api/auth/callback/google`.

L’adresse doit être vérifiée et appartenir exactement à `digitevent.com`. Le domaine Google Workspace `hd` est également contrôlé, lors de la première connexion et des suivantes. Les connexions email/mot de passe et l’inscription par formulaire sont désactivées en production. Voir la [configuration Google de Better Auth](https://better-auth.com/docs/authentication/google) et le [plugin Organization](https://better-auth.com/docs/plugins/organization).

Chaque utilisateur peut créer une équipe dont il devient propriétaire ; rejoindre une équipe existante exige une invitation. Les anciennes données sans équipe sont conservées, mais ne sont pas exposées en production tant qu’un administrateur de la base ne leur a pas attribué explicitement une équipe. Ne pas déployer la base de développement ni ses secrets.

## Édition

- Composants Digi, calques et chat dans le panneau gauche ; canvas à plusieurs frames au centre ; Design et Inspect à droite.
- Sélection, déplacement, redimensionnement, zoom, alignement, répartition, duplication, copier/coller et historique local. Les props et slots exposés proviennent du manifest.
- Couleurs libres ou tokens, HEX/RGB/HSL/CSS, opacité, couleurs de la page et pipette quand le navigateur fournit EyeDropper.
- Statuts : Brouillon, En cours, À valider et Validée, modifiables dans le studio et dans l’éditeur.
- Sauvegarde après 1,5 seconde d’inactivité, contrôle de révision et brouillon local en cas d’échec. Un conflit conserve le brouillon sans remplacer la version serveur.
- Aperçu rendu par React à partir des snapshots générés pendant la sync ; Inspect affiche mesures, propriétés, tokens et snippet React. Les handlers React sont pris en charge, mais les comportements internes de certains composants Vue (menus, onglets, formulaires) restent à porter.
- Instances Digi liées avec overrides de props, contenu, dimensions et styles ; détachement en éléments HTML éditables ; variantes locales réutilisables dans toute la maquette.

Raccourcis hors champs de saisie : V sélection, H main, F frame, R conteneur, T texte, espace-glisser pour déplacer le canvas, Cmd/Ctrl-molette pour zoomer, ⇧1 pour tout afficher, ⇧2 pour cadrer la sélection, ⇧P pour l’aperçu, ⇧D pour Inspect, Cmd/Ctrl-Z pour annuler. Alt-glisser duplique ; Shift conserve les proportions au redimensionnement.

Le chat de l’éditeur utilise les API OpenAI et Anthropic avec AI SDK et Trigger.dev Cloud, payées par le studio. Il conserve les conversations privées, propose des changements Digi et les applique après validation en une étape annulable. Voir [la configuration, la migration et le déploiement](docs/AI_CHAT.md). Sans configuration API/Trigger, le chat reste indisponible.

Une démonstration interactive reste accessible sur activation : questions, validation de plan, activité et résultats enrichis. Les réponses utilisent TanStack Markdown. Les données de démonstration sont conservées localement par maquette ; ces scénarios ne modifient pas le document et ne contactent aucun fournisseur IA. Partage public, collaboration simultanée, prototypage et dessin vectoriel ne font pas partie de cette étape. Les composants nécessitant des données métier ou un contexte obligatoire sont désactivés tant qu’une recette d’insertion valide n’est pas disponible.

Code : `src/pages/editor/` pour la page, `src/features/editor/` pour le moteur, `packages/shared/` pour le document et le bridge, `renderer/src/ReactRenderFrame.tsx` pour les frames React et `renderer/src/App.vue` pour le shell d’iframe, `packages/digicomponents-react/` pour les exports générés, `src/features/mockups/` pour la persistance.

## Réutiliser

Importer les primitives depuis `@/components/ui/` et les compositions depuis `@/components/shared/`. Utiliser leurs variantes et les tokens du thème.

```tsx
import { Button } from "@/components/ui/button"
import { StatusIcon } from "@/components/shared/StatusIcon"

;<Button variant="outline" size="sm">
  <StatusIcon status="in-progress" />
  En cours
</Button>
```

Chaque fiche du catalogue permet de modifier les variantes, les tailles et les états. L’onglet **Code** contient les imports et les réglages de l’aperçu.

Voir [le guide du système d’interface](docs/DESIGN_SYSTEM.md) pour la typographie, les thèmes, les statuts et l’ajout d’un composant.

## Vérifier

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:db  # nécessite PostgreSQL ; crée puis supprime sa propre base de test
pnpm build
```

## Ajouter une primitive shadcn

```bash
pnpm exec shadcn add <composant>
```

Conserver le composant dans `src/components/ui/`, puis ajouter un exemple et son entrée au catalogue. Les contrôles de sélection utilisent `Select` ou `Combobox`, avec un menu shadcn.

## Base de données locale

PostgreSQL 17 est fourni avec Docker Compose. Le volume `postgres_data` conserve les données entre les redémarrages.

```bash
cp .env.example .env
docker compose up -d postgres
docker compose ps
```

Appliquer les migrations SQL versionnées après le démarrage PostgreSQL :

```bash
pnpm db:migrate
```

Pour modifier le schéma, éditer `src/db/schema.ts`, lancer `pnpm db:generate`, relire le SQL généré dans `drizzle/`, puis appliquer `pnpm db:migrate`. Le document est stocké en JSONB avec statut, révision, version de bibliothèque et dates. La connexion PostgreSQL reste côté serveur.

Pour arrêter Postgres sans perdre les données :

```bash
docker compose down
```

Pour repartir de zéro, supprime aussi le volume avec `docker compose down -v` ; cette commande efface les données locales.

Le port local par défaut est `5433` (5432 étant déjà occupé sur cette machine). L’URL de connexion est `postgresql://digit:digit_dev@localhost:5433/digit_ai_studio` (`DATABASE_URL` dans `.env`). Change `POSTGRES_PORT` si besoin.

# Connexion Claude Code

Pour modifier les maquettes du site depuis Claude Code sur un PC, voir [la configuration MCP](docs/CLAUDE_CODE_MCP.md).

## Sites React + Vite

Le bouton **Nouveau site** crée un projet React ou Vue avec Vite et TypeScript, à partir du starter officiel et de sa démonstration. **Nouvelle maquette** conserve le renderer historique. Les fichiers du projet sont stockés en base, avec une révision et des versions restaurables ; les propositions IA obsolètes sont refusées.

Dans l’éditeur, **Fichiers** permet de parcourir les sources et assets et de consulter le code. **Navigation** utilise le site ; **Édition** sélectionne les éléments pour modifier le texte statique et les styles, avec des portées desktop/tablette/mobile. Les sélecteurs utilisent shadcn. Les valeurs dynamiques et modifications structurelles passent par le chat.

Après installation, appliquer les migrations avec `pnpm db:migrate`. Les sites sont installés, compilés et exécutés localement dans le navigateur avec WebContainers. Le chat utilise la configuration IA/Trigger existante décrite dans `docs/AI_CHAT.md`.

**Exporter ZIP** prépare et vérifie le projet dans un dossier WebContainer isolé, puis crée une archive avec ses assets, son `package-lock.json` et les instructions `npm ci`. Le scénario sélectionné est conservé. La progression et les erreurs sont affichées, un export échoué peut être relancé, et les deux derniers documents préparés sont gardés en cache pendant la session. Aucun pont de sélection du Studio n’est exporté. Le serveur d’hébergement doit rediriger les routes du site vers `index.html`. Pour vérifier une installation vierge et le build d’un ZIP téléchargé : `pnpm exec tsx scripts/verification/verify-site-export.ts /chemin/site.zip` (sans argument, le script génère et vérifie un nouveau projet React avec create-vite).

Chaque nouveau site est généré côté serveur avec la [commande officielle Vite](https://vite.dev/guide/) : `npm create --yes vite@latest site -- --template react-ts --no-interactive --no-immediate` (ou `vue-ts`). Le serveur doit disposer de npm et accéder au registre npm. Les sources officielles sont enregistrées dans le projet ; aucun template local n’est conservé. Les dépendances sont ensuite installées dans le navigateur par WebContainers. Les projets existants conservent leurs fichiers.

## Organisation du code

Voir [l’architecture du Studio](docs/ARCHITECTURE.md) pour les schémas par domaine, les validateurs, les types dérivés des sorties oRPC et les responsabilités des services.
