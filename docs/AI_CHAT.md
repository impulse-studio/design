# Chat IA : AI SDK et Trigger.dev Cloud

Le studio utilise des clés API centrales OpenAI et Anthropic. Les abonnements ChatGPT/Claude ne financent pas ces appels. Les utilisateurs gardent leurs conversations privées sur des maquettes partagées. Une proposition ne modifie rien avant **Appliquer**, puis passe par la sauvegarde de l’éditeur en une étape annulable.

## Configuration

Versions épinglées dans `package.json` et le lockfile : AI SDK 7, adaptateurs officiels, SDK/CLI Trigger.dev 4.6.4. Les tâches utilisent `chat.agent` et le client `useChat`/`useTriggerChatTransport`. Node 22 exécute les tâches ; Node 24 héberge le studio.

1. Créer un projet dans Trigger.dev Cloud. Renseigner `TRIGGER_PROJECT_REF` et la clé d’environnement `TRIGGER_SECRET_KEY` (développement ou production, jamais mélangées).
2. Générer `AI_CALLBACK_SECRET` avec `openssl rand -base64 32`. Mettre la même valeur sur le serveur web et dans les variables de l’environnement Trigger.
3. Sur Trigger uniquement, configurer `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` et `AI_STUDIO_URL`, l’URL HTTPS du studio. Le serveur web n’a pas besoin des clés des fournisseurs.
4. Sur le web, configurer `AI_MODELS` comme un tableau JSON d’objets `{ "id": "openai:<identifiant-API>", "displayName": "Nom affiché" }` ou `anthropic:<identifiant-API>`. Utiliser des identifiants réellement accessibles par les clés centrales, pas les noms commerciaux des abonnements. `AI_DEFAULT_MODEL` doit correspondre à une entrée. `AI_ENABLED_PROVIDERS` contient `openai,anthropic`, ou uniquement les fournisseurs dont les clés ont été installées. Ne pas préfixer ces variables par `VITE_`.
5. Exécuter `pnpm db:migrate`, puis `pnpm trigger:deploy` avec les variables du projet. Pour le développement : `pnpm trigger:dev` et `pnpm dev` dans deux terminaux. Les callbacks du worker local peuvent utiliser `http://localhost:3402`. Un worker Cloud nécessite une URL HTTPS joignable (y compris pour un environnement de recette).

Aucun projet Cloud, abonnement ou déploiement payant n’est créé par les scripts de build. Une configuration vide affiche clairement l’indisponibilité du chat.

## Flux et limites

- Les routes `/api/ai/*` authentifient la session existante et recontrôlent l’appartenance à la maquette. Les écritures navigateur exigent la même origine. Les autorisations de modification sont requises lors de l’application.
- L’action `send` réserve une génération avec identifiant idempotent et capture le document sauvegardé, sa révision, son empreinte et la sélection. Le proxy accepte uniquement le message correspondant à cette réservation ; il remplace les métadonnées client par l’identifiant serveur.
- Le navigateur utilise exclusivement le proxy du studio pour les entrées et le SSE Trigger. La valeur `studio-session` est un marqueur sans privilège, pas un jeton Trigger. Le serveur génère et injecte les jetons de session en interne. Les réponses de création de session ne les exposent pas.
- Les callbacks `/api/ai/callback` utilisent HMAC-SHA256 sur le corps et l’horodatage, avec une fenêtre de 60 secondes. Le serveur vérifie l’association conversation/génération et les droits avant les lectures et écritures. Les propositions sont dédupliquées par appel d’outil. Les workers terminés ne peuvent pas modifier la génération suivante.
- PostgreSQL conserve le transcript structuré, les réponses partielles, les propositions et la consommation par génération. Le stockage de transcript Trigger est branché sur ces callbacks ; la base n’est pas exposée au Cloud.
- Une génération active par utilisateur ; deux simultanées globalement via admission PostgreSQL et file Trigger. Les générations suivantes restent en attente. Une génération dure au plus dix minutes, avec 8 192 tokens de sortie par appel et deux étapes maximum. Les tâches ne gardent pas de calcul actif entre les tours.
- Un heartbeat persiste le texte toutes les deux secondes et interrompt le modèle si les droits sont révoqués, le serveur indisponible ou la génération arrêtée. Une lease inactive pendant une minute est interrompue lors de la prochaine admission/lecture ; une génération en attente expire après dix minutes.
- La reconnexion au flux ne renvoie pas le message. La récupération après un crash conserve les données déjà persistées et ne redistribue pas le tour ambigu. Les appels modèle n’ont aucun retry automatique. Cela évite une relance volontaire facturable ; une interruption réseau ne permet pas de garantir qu’un fournisseur n’a rien facturé.
- Les budgets financiers se configurent chez les fournisseurs et Trigger.dev. Le studio affiche les tokens retournés par les API ; une consommation manquante reste « indisponible ».

## Migration depuis Codex

La migration additive `0005_api_chat.sql` conserve les données, convertit les anciens couples prompt/réponse en messages structurés et interrompt les anciennes générations actives. Ne pas modifier ou rejouer manuellement `0004_codex_chat.sql`. La table historique `ai_connections` est conservée mais n’est plus utilisée.

Le service runner et son socket Docker sont retirés du Compose. Aucun identifiant Codex n’est utilisé. Lors de la mise à jour, arrêter l’ancien runner et ses conteneurs Codex après vérification de leur nom. Les anciens volumes privés doivent être inventoriés, puis supprimés explicitement par l’exploitant lorsqu’ils ne sont plus nécessaires ; aucune purge automatique n’est effectuée.

## Hébergement et sauvegardes

`compose.production.yaml` conserve PostgreSQL privé, les migrations, Node et Caddy HTTPS. Configurer les variables de `.env.example`, `STUDIO_DOMAIN` et les secrets d’authentification existants, puis utiliser `docker compose -f compose.production.yaml up -d --build` après sauvegarde et validation en recette. Trigger est déployé séparément avec son CLI.

Sauvegarder PostgreSQL avec `pg_dump -Fc`, chiffrer les exports et les conserver hors du VPS. Tester la restauration avec `pg_restore` dans une base distincte. Sauvegarder la configuration et les secrets séparément ; ne jamais les committer. Conserver le lockfile et les versions de tâches pour pouvoir revenir à un déploiement connu. Le coût du VPS n’inclut ni Trigger.dev Cloud, ni les API, ni le domaine.

## Recette

Automatique : `pnpm test`, `pnpm test:db`, `pnpm typecheck`, `pnpm lint`, `pnpm build`. Les tests PostgreSQL créent et suppriment des bases de test dédiées ; ils nécessitent le PostgreSQL local de `compose.yaml` et un rôle autorisé à créer des bases.

Avec de vraies clés et un projet Trigger de recette : tester chaque fournisseur, deux utilisateurs sur une maquette commune, les limites API, un refus, une application et son annulation, la révocation des droits, l’arrêt pendant la réponse, un rafraîchissement en streaming, puis un redémarrage du worker et du web. Vérifier qu’aucun nouveau tour n’est créé par la reconnexion et que les appels ambigus ne sont pas rejoués. Vérifier clavier, thèmes clair/sombre et réduction des animations. Les essais payants réels sont distincts des tests locaux simulés.

Références : [Trigger chat](https://trigger.dev/docs/ai-chat/overview), [transport](https://trigger.dev/docs/ai-chat/reference), [cycle de vie et stockage](https://trigger.dev/docs/ai-chat/lifecycle-hooks), [AI SDK](https://ai-sdk.dev/).
