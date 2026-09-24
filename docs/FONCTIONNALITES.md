# Digit AI Studio — Fonctionnalités

> Résumé de toutes les fonctionnalités prévues. Le détail technique est dans [SPEC.md](./SPEC.md).
> Légende : ✅ V1 · 🔜 V1.1 · 💭 V2 / à décider

## En une phrase
Un **Figma + Figma Make interne** où chaque maquette est rendue avec les **vrais composants Digitevent** (`digicomponents`) et le **vrai shell du backoffice**. On la génère par prompt (texte, spec ou image) avec son abonnement Claude, on l'affine comme dans Figma, et les devs l'inspectent en Dev Mode.

---

## 1. Accueil — Mes maquettes
- ✅ Sidebar : Récents, Projets, Corbeille, recherche ⌘K
- ✅ Bouton **Nouvelle maquette** (nom + projet)
- ✅ Vue **grille** (miniatures) et vue **liste** (tableau triable et filtrable, sélection multiple)
- ✅ Onglets Récents / Tous / Partagés, tri par date de modification, nom ou création
- ✅ Menu contextuel : ouvrir, renommer, dupliquer, déplacer, copier le lien de partage, supprimer
- ✅ Projets pour ranger les maquettes, corbeille restaurable

## 2. Canvas (le cœur Figma)
- ✅ Canvas infini : pan (espace + drag, trackpad), zoom de 5 % à 400 %, zoom sur tout, zoom sur la sélection
- ✅ **Plusieurs frames** par maquette, avec des tailles prédéfinies : Desktop 1440, Laptop 1280, Tablet 768, Mobile 390, ou taille libre
- ✅ Chaque frame est une iframe qui rend la page avec les vrais composants
- ✅ Sélection au clic (le plus profond, double-clic pour entrer dans un groupe, ⌘ clic pour une sélection directe), multi-sélection ⇧
- ✅ Contour bleu, poignées, étiquette `W × H`, survol, padding et gap visualisés en rose
- ✅ Mesures de distance avec ⌥ au survol
- ✅ Édition de texte directement dans le canvas (double-clic)
- ✅ Mode **Preview ▶** pour interagir réellement (menus, modales, onglets)
- ✅ Toolbar : Move, Frame, Hand, Insérer un composant, bascule Dev Mode
- 💭 Dessin libre (rectangle, pen), prototypage (liens entre frames), commentaires

## 3. Layers (panneau gauche)
- ✅ Arbre de calques type Figma : frames, composants Digi (violet), templates shell, conteneurs auto-layout, textes, images
- ✅ Sélection synchronisée avec le canvas, survol qui surligne la zone
- ✅ Glisser-déposer pour réordonner ou changer de parent
- ✅ Renommer, masquer 👁, verrouiller 🔒, plier et déplier
- ✅ Clic droit : dupliquer, supprimer, envelopper dans un auto-layout, désenvelopper, copier/coller, **Demander à l'IA…**
- ✅ Recherche de calque
- ✅ Onglet **Assets** : tous les composants Digi et templates, à glisser dans le canvas

## 4. Propriétés — onglet Design (panneau droit)
- ✅ **Auto layout** : direction (↓ →, retour à la ligne), gap (ou « auto » = espace réparti), padding (uniforme, H/V ou 4 côtés), alignement 9 points
- ✅ **Taille** : W / H en **Fixe / Hug / Fill**, min et max
- ✅ **Frame** : taille prédéfinie, dimensions, fond
- ✅ **Props du composant** générées automatiquement depuis la librairie : texte, switch, liste de variants, icône, nombre
- ✅ Données complexes (lignes de tableau, colonnes) : éditeur JSON, avec un bouton pour générer des données fictives par l'IA
- ✅ **Apparence** (tokens uniquement) : fond, bordure, rayon, ombre, opacité
- ✅ **Texte** : style typographique Digitevent, graisse, couleur
- ✅ Champs numériques ajustables à la souris, comme dans Figma
- ✅ Valeurs hors token possibles, mais signalées ⚠
- ✅ Annuler / rétablir (⌘Z / ⇧⌘Z), sauvegarde automatique

## 5. IA — Chat (panneau gauche, onglet AI)
- ✅ Prompter avec **mon abonnement Claude** (token `claude setup-token` collé dans les Settings)
- ✅ **Créer une page à partir d'une problématique** : coller une issue ou une spec, l'IA construit une page crédible
- ✅ **Reproduire une image** : coller une capture, l'IA la refait avec les composants Digi et liste les composants manquants
- ✅ **Micro-corrections ciblées** : je sélectionne un élément, je prompte, seul cet élément change
- ✅ L'IA n'utilise **que** les composants et tokens Digitevent, et le vrai shell (EventLayout, menu, header)
- ✅ Le canvas se met à jour **en direct** pendant que l'IA travaille
- ✅ Réponses en Markdown, raisonnement repliable, liste des actions appliquées (cliquables pour sélectionner l'élément)
- ✅ Carte « Version N » après chaque prompt : restaurer, voir le diff
- ✅ Choix du modèle (Opus / Sonnet), bouton stop
- ✅ Un historique de chat par maquette
- 🔜 Image de référence en superposition semi-transparente sur la frame, pour comparer
- 🔜 Auto-vérification : l'IA regarde son rendu et se corrige

## 6. Dev Mode — onglet Inspect
- ✅ Nom du composant et **import** à copier (`import { DigiButton } from 'digicomponents'`)
- ✅ Lien vers le fichier source dans orchestration
- ✅ Tableau des **props** : valeur, défaut, type, overrides en gras
- ✅ **Box model** : margin, border, padding, taille
- ✅ **Layout et tokens** en CSS, Tailwind ou SCSS (`gap: var(--spacing-md) /* 16px */`)
- ✅ Tokens utilisés : couleurs (pastille + nom), typographie, rayons, espacements
- ✅ **Snippet Vue** de l'élément sélectionné, à copier
- ✅ Alerte sur les valeurs hors tokens
- 🔜 Export PNG d'une frame ou d'un élément

## 7. Historique des versions
- ✅ Version automatique à chaque prompt, autosaves groupés, versions nommées ⭐
- ✅ Prévisualiser une ancienne version (bandeau « vous regardez la version du… »)
- ✅ Restaurer, sans jamais rien détruire (la restauration crée une nouvelle version)
- ✅ Liste des éléments ajoutés, modifiés ou supprimés entre deux versions
- 🔜 Diff visuel

## 8. Partage aux devs
- ✅ Bouton **Share** qui génère un lien `/share/…`, copié automatiquement
- ✅ Lien lié à une version précise ou toujours à la dernière
- ✅ Vue en lecture seule : canvas, layers, Dev Mode, sans chat ni édition
- ✅ Liens révocables, avec expiration optionnelle et compteur de vues
- 💭 Connexion Google `@digitevent.com` pour les devs

## 9. Librairie de composants & release
- ✅ Skill **`/sync-digicomponents`** : build de la lib depuis orchestration, copie dans le studio, récupération du shell backoffice
- ✅ Génération d'un **manifest** : props, slots, events, exemples tirés des stories Histoire, tokens
- ✅ Règles d'usage pour l'IA, éditables à la main (`ai-notes.yaml`)
- ✅ Changelog automatique : composants ajoutés ou supprimés, props modifiées
- ✅ Vérification que les maquettes existantes restent valides
- ✅ Release = commit, push, déploiement automatique sur Railway
- 💭 Page « Librairie » : planche de tous les composants rendus

## 10. Settings
- ✅ Token Claude (masqué, chiffré, bouton « Tester »), modèle par défaut
- ✅ **Usage** : graphiques des générations et tokens par jour, top des composants utilisés
- ✅ Version de la librairie synchronisée (commit, date, nombre de composants)
- ✅ Liste des liens de partage actifs (révoquer)
- 💭 Prompt système maison éditable

## 11. Compte & sécurité
- ✅ Connexion via **Better Auth** (email + mot de passe), inscription publique fermée
- ✅ Rôles owner / viewer (prêt pour ouvrir à d'autres plus tard)
- ✅ Token Claude jamais renvoyé au navigateur, chiffré en base
- ✅ Liens de partage en lecture seule stricte

---

## Stack
TanStack **Start / Router / Query / Store / Form / Table / Charts / Markdown** · React 19 + shadcn (interface du studio) · Vue 3 + digicomponents (rendu des frames) · Better Auth · Drizzle + Postgres · Claude Agent SDK · Railway

## Jalons
| # | Contenu |
|---|---|
| M0 | Prototype du rendu : vrais composants + shell EventLayout dans une iframe |
| M1 | Skill de sync + manifest |
| M2 | Socle : base de données, Better Auth, page d'accueil, projets / maquettes |
| M3 | Éditeur : canvas, frames, sélection, layers, propriétés, annuler/rétablir |
| M4 | IA : chat, génération, micro-corrections, image |
| M5 | Versions, partage, Dev Mode |
| M6 | Finitions et mise en prod |
