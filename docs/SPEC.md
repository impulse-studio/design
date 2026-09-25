# Digit AI Studio — Spec V1

> Document de travail vivant : on itère dessus section par section. Chaque section se termine par ses **questions ouvertes** (❓) quand il en reste.
> Date : 2026-09-24 · Auteur : Nicolas Becharat · Statut : draft v0.1

---

## Périmètre livré — éditeur local

Cette étape met en place le studio `/`, l’éditeur `/m/$mockupId`, les statuts de maquette, un rendu React des frames dans une iframe (avec un shell de communication Vue), les couleurs et les gestes d’édition, ainsi que PostgreSQL/Drizzle avec autosave et récupération locale. Les exports React de Digi sont générés à la sync depuis les snapshots SSR d’Orchestration ; leurs interactions métier ne sont pas toutes portées. La page est organisée sous `src/pages/editor/`.

L’accès au studio repose sur Better Auth et les équipes. Le chat utilise les API OpenAI et Anthropic via AI SDK et Trigger.dev Cloud ; voir [le périmètre et la configuration](AI_CHAT.md). Les sections ci-dessous conservent la vision initiale, notamment les pistes image, liens publics, collaboration, prototypage et versions serveur qui ne décrivent pas cette implémentation. Le [README](../README.md) décrit les commandes utilisables.

## 0. Liens
- Repo studio : `digit/digitAiStudio` (scaffold TanStack Start + React 19 + Tailwind 4 + shadcn `base-vega`)
- Lib de composants : `digit/orchestration/lib/digicomponents` (Vue 3.5, reka-ui, Tailwind 4, ~294 `.vue`, 114 stories Histoire)
- Tokens : `orchestration/lib/digicomponents/src/style/main.css`, `tailwind.config.js`, `src/style/variables.scss`
- Shell backoffice : `orchestration/back/src/layouts/eventLayout/EventLayout.vue`, `back/src/layouts/components/Header/DigiHeader.vue`, `back/src/navigation/eventMenu/`
- Références UX : Figma (Recents, Design, Dev Mode/Inspect, Version history), Figma Make (chat + preview), Google AI Studio

---

## 1. Contexte & problème
Aujourd'hui, maquetter une page Digitevent passe par Figma. Or :
- la maquette Figma **dérive** de la réalité du code (composants pas à jour, tailles approximatives, états manquants) ;
- les devs doivent **retraduire** la maquette en composants `Digi*`, deviner les tokens, les gaps, les variantes ;
- les micro-corrections (« 8px de gap en trop », « mauvais variant de bouton ») font des aller-retours ;
- partir d'une **problématique** (issue, spec, retour client) pour arriver à une page crédible prend du temps.

**Digit AI Studio** : un éditeur type Figma dont le « rendu » est le **vrai code Digitevent**. On prompte (texte ou image), l'IA assemble une page avec les vrais composants et le vrai shell du backoffice, puis on affine à la main (layers, auto-layout, props) ou par prompt ciblé. Les devs ouvrent un lien et voient exactement quels composants, quelles props, quels tokens.

## 2. Objectifs / Non-objectifs
**Objectifs V1**
1. Créer autant de maquettes que voulu, chacune contenant plusieurs frames (desktop, mobile…) sur un canvas infini.
2. Générer / modifier une maquette par prompt (texte, spec collée, image à reproduire) via mon abonnement Claude.
3. Éditer sans code : arbre de layers à gauche, inspecteur Figma à droite (auto-layout, gap, padding, W/H, hug/fill, props du composant).
4. Rendu **pixel-identique** à l'app Digitevent (vrais composants + vrais tokens + vrai shell).
5. Dev Mode en lecture via lien : composant, import, props, box model, tokens CSS, snippet React.
6. Historique de versions restaurable.
7. Mise à jour de la lib via un skill → release du studio.

**Non-objectifs V1**
- Multi-éditeurs / temps réel collaboratif.
- Outils de dessin libre (rectangle, pen, vecteurs).
- Prototypage (liens entre frames, interactions).
- Export du code prêt à merger dans `back` (le snippet Dev Mode est indicatif).
- Pages invitées (`front`) — V2.

## 3. Utilisateurs & rôles

Auth : **Better Auth**, intégré à TanStack Start (handler `/api/auth/*`, adapter Drizzle/PostgreSQL, plugin Organization). Une organisation Better Auth correspond à une équipe dans l’interface.

- Production : connexion Google uniquement, adresse vérifiée `@digitevent.com` et domaine Google Workspace `hd=digitevent.com`, contrôlés à chaque connexion.
- Développement : compte `dev@digitevent.com` sans Google, activé explicitement uniquement sur localhost en mode développement. Il est propriétaire de l’équipe locale.
- Chaque utilisateur peut créer une équipe. L’accès à une équipe existante nécessite une invitation nominative, valable 7 jours, acceptée depuis `/teams`. Pas d’envoi d’email automatique.
- Gestion des membres, rôles, invitations, changement d’équipe, renommage et départ depuis `/teams`.
- Maquettes isolées par équipe. Les permissions sont vérifiées sur les fonctions serveur et dans les requêtes de persistance. Les lecteurs restent en inspection sans autosauvegarde.

| Rôle | Droits |
| --- | --- |
| Propriétaire | Toutes les actions, gestion des propriétaires. Le dernier propriétaire ne peut pas quitter l’équipe ni perdre son rôle. |
| Administrateur | Création et édition des maquettes, invitations, gestion des membres hors propriétaires, renommage. |
| Éditeur | Création et édition des maquettes de son équipe. |
| Lecteur | Lecture, aperçu et Dev Mode. |

Le partage public `/share/$token`, les rôles personnalisés et la collaboration simultanée restent des évolutions séparées.

## 4. Glossaire
- **Projet** : dossier regroupant des maquettes (ex. « Refonte inscriptions »).
- **Maquette (Mockup)** : un fichier, équivalent d'un fichier Figma. Contient des **pages** (V1 : 1 page) et des **frames**.
- **Frame** : un artboard avec une taille (preset Desktop 1440×900, Laptop 1280×800, Tablet 768×1024, Mobile 390×844, ou custom). Rendu dans une iframe.
- **Node** : élément de l'arbre (composant Digi, conteneur, texte, image, template shell).
- **Template** : node composite pré-construit issu du shell `back` (EventLayout, SettingsPageLayout…) avec des **slots** à remplir.
- **Manifest** : description machine de la lib (composants, props, slots, exemples, tokens) générée par le skill de sync.
- **Version** : snapshot de l'arbre complet d'une maquette.

---

## 5. Parcours clés
### 5.1 Nouvelle page à partir d'une problématique
1. Recents → « Nouvelle maquette » → nom + projet.
2. Éditeur vide avec une frame Desktop. Chat à gauche (onglet « AI »).
3. Je colle une issue : « Les organisateurs ne trouvent pas comment relancer les invités qui n'ont pas répondu ».
4. L'IA répond en markdown (reasoning court + plan), puis applique ses outils : `create_frame`, `insert_node(EventLayout)`, remplit le slot contenu avec `DigiTablePageLayout` + `DigiTable` + `DigiButton "Relancer"`…
5. Le canvas se met à jour **en streaming** (chaque tool call visible).
6. Une carte « Version 3 · Latest » apparaît dans le chat ; version sauvegardée.

### 5.2 Reproduire une image
1. Drag & drop / coller une capture dans le chat (+ texte optionnel).
2. L'IA décrit ce qu'elle voit, mappe chaque zone à un composant Digi (sinon au plus proche + note « composant manquant »), construit.
3. Je compare en mettant l'image en **overlay** semi-transparent sur la frame (toggle opacité) — ❓ V1 ou V1.1 ?

### 5.3 Micro-correction
1. Je clique un bouton dans la frame → sélectionné (outline bleu, label taille, layer surligné).
2. Soit je change dans l'inspecteur (variant `secondary`, gap 16→12), soit je prompte « passe-le en secondary et aligne-le à droite ».
3. Avec une sélection, le prompt est **scopé** : l'IA ne touche que ce sous-arbre (contrainte côté outils).

### 5.4 Partage aux devs
1. Bouton **Share** → génère un lien `/share/<token>` (copie auto) ; option « lier à la version courante » ou « toujours la dernière ».
2. Le dev ouvre : canvas en lecture, layers, panneau droit en mode **Inspect**.

### 5.5 Mise à jour de la lib
1. Dans `digitAiStudio`, je lance le skill `/sync-digicomponents`.
2. Il pull/build la lib depuis `../orchestration`, copie les assets, régénère le manifest, affiche un diff (composants ajoutés/supprimés/props changées).
3. Il vérifie que les maquettes existantes restent valides (nodes pointant vers un composant supprimé → rapport).
4. Commit `chore: sync digicomponents <sha orchestration>` → push → deploy Railway.

---

## 6. Écrans & UI (détaillé)
Look & feel : l’UI du **studio** utilise Digit UI, construit en shadcn/React et inspiré de l’application Linear : Inter pour les contrôles, Inter Display pour les titres, surfaces neutres claires et sombres, densité compacte et indicateurs de statut sémantiques. Les composants, variantes et tokens sont documentés dans `docs/DESIGN_SYSTEM.md`. Le thème du renderer Digitevent reste propre au contenu des maquettes.

### 6.1 Recents `/`
- Sidebar gauche (240px) : avatar + nom, recherche (⌘K), **Recents**, **Projets** (liste), **Corbeille**.
- Header : titre, bouton primaire **Nouvelle maquette**.
- Filtres : onglets `Récents | Tous | Partagés`, tri (Dernière modif, Nom, Création), toggle **grille / liste**.
- Grille : cartes avec **thumbnail** (capture de la 1re frame, générée au save), nom, « Modifié il y a 1h ».
- Liste : **TanStack Table** (colonnes nom, projet, frames, versions, dernière modif, partagé ?, actions ; tri, filtre, sélection multiple → déplacer / supprimer).
- Menu contextuel carte : Ouvrir, Renommer, Dupliquer, Déplacer, Copier le lien de partage, Supprimer.

### 6.2 Éditeur `/m/$mockupId`
Layout 3 colonnes + toolbar flottante :
```
┌──────────────┬───────────────────────────────────────┬──────────────────┐
│ Left 280px   │ Canvas                                │ Right 300px      │
│ [File|AI]    │                                       │ [Design|Inspect] │
│ Pages        │   Desktop ─────────   Mobile ──       │  zoom %          │
│ Layers tree  │   │ iframe       │   │iframe│         │  sections…       │
│   or         │   └──────────────┘   └──────┘         │                  │
│ Chat         │                                       │                  │
│              │          [▸ ▭ T ⌘ 💬 </>]  toolbar     │                  │
└──────────────┴───────────────────────────────────────┴──────────────────┘
```
**Top-left** : menu (retour Recents), nom de la maquette (renommable inline), projet.
**Top-right** : avatar, bouton **Share**, zoom %, bouton **History** (ouvre le panneau versions à droite).

#### 6.2.1 Panneau gauche — onglet File
- **Pages** (V1 : une page, UI prête pour plusieurs — ❓).
- **Layers** : arbre de nodes.
  - Icônes : `#` frame, `◇` composant Digi (violet, comme Figma instances), `▦` template shell, `▭` conteneur auto-layout (icône direction ↓ / →), `T` texte, `🖼` image.
  - Nom = `node.name` sinon nom du composant + libellé (ex. `DigiButton · Relancer`).
  - Interactions : clic = sélection, ⇧ clic = multi, double-clic = renommer, drag & drop pour réordonner / reparenter, œil = masquer, cadenas = verrouiller, chevron = plier.
  - Hover d'un layer → highlight dans le canvas.
  - Clic droit : Dupliquer (⌘D), Supprimer, Wrap in auto-layout (⌥⌘G), Unwrap, Copier/coller, « Demander à l'IA… » (focus chat avec la sélection).
- Recherche de layer.
- Section **Assets** (onglet secondaire) : liste des composants Digi du manifest groupés par catégorie + templates → drag sur le canvas / dans un conteneur pour insérer.

#### 6.2.2 Panneau gauche — onglet AI (chat)
- Fil de messages : messages user (texte + vignettes images), réponses assistant rendues en **Markdown** (TanStack Markdown / fallback), blocs « Reasoning » repliables, liste des actions appliquées (« ✓ Inséré DigiTable dans Contenu », « ✓ gap 24 → 16 ») cliquables (sélectionnent le node).
- Carte **Version N** après chaque tour, avec « Restaurer » / « Voir le diff ».
- Composer : textarea « Décris une page ou une modification… », boutons : 📎 image (drag/paste aussi), chip **Contexte : [nom du layer sélectionné] ✕**, sélecteur de modèle (Opus / Sonnet), bouton envoyer / stop.
- Suggestions quand vide : « Page liste des participants », « Écran de paramètres d'inscription », « Reproduire une capture ».
- Un fil de chat **par maquette** (persisté).

#### 6.2.3 Canvas
- Fond `#F5F5F5` (réglable), pan (espace+drag, trackpad, molette), zoom (⌘+molette, pinch, ⌘0 = 100 %, ⇧1 = fit all, ⇧2 = fit selection), zoom 5 %–400 %.
- Frames positionnées en coordonnées canvas ; titre au-dessus (cliquable = sélection frame, double-clic = renommer), bouton `</>` dans le titre = ouvrir Dev Mode sur la frame.
- Chaque frame = `<iframe>` à taille réelle, scalée via CSS transform du monde.
- **Overlay de sélection** (dessiné par le shell au-dessus des iframes, pas dans l'iframe) : outline bleu 1px, poignées, label `W × H`, hover outline fin, padding/gap visualisés en rose (comme Figma) quand un conteneur auto-layout est sélectionné.
- Mesures : maintenir ⌥ au survol = distances entre sélection et node survolé.
- Toolbar flottante : **Move (V)**, **Frame (F)** (dessiner une frame / choisir un preset), **Hand (H)**, **Insert component (I)** (popover recherche manifest), **Comment** ❓(V2), **Dev Mode toggle (⇧D)**.
- Sélection dans l'iframe : clic sélectionne le node le plus profond ; double-clic = entrer dans le groupe (comportement Figma) ; ⌘ clic = sélection profonde directe. Les composants restent **non interactifs** en mode édition (pointer-events capturés) ; mode **Preview (▶)** pour interagir réellement (menus, modales).
- Édition texte inline : double-clic sur un node Text ou sur une prop texte (label de bouton) → contentEditable → commit.

#### 6.2.4 Panneau droit — onglet Design (éditeur)
Sections selon le type de node (toutes via **TanStack Form**, champs numériques scrubbables à la souris comme Figma) :
- **Header** : nom du type (`DigiButton`), bouton « Aller à la doc » (story), `⋯` (Reset overrides).
- **Frame** : preset (select), W, H, fond, clip content.
- **Position** (enfants de frame en absolu uniquement) : X, Y ; alignements.
- **Auto layout** (conteneurs) : direction (↓ / → / wrap), gap (avec option « auto » = space-between), padding (uniforme / H-V / 4 côtés), alignement 9-points, align-items.
- **Taille** : W et H avec mode **Fixed / Hug / Fill**, min/max.
- **Props du composant** : générés depuis le manifest :
  - `string` → input, `boolean` → switch, union littérale → select/segmented, `number` → number, icône → picker remixicon, enum de variants (cva) → select avec preview.
  - slots → liste « Slot default : 3 enfants » (clic = sélectionner le slot dans les layers).
  - Props complexes (tableaux de données, colonnes de table) → éditeur JSON (Monaco léger) + bouton « Générer des données fictives avec l'IA ».
- **Apparence** (conteneurs/texte uniquement, **tokens only**) : fond (select parmi tokens `background`, `muted`, `card`…), bordure (token + largeur), radius (tokens `radius-sm/md/lg`), ombre (tokens), opacité.
- **Texte** : style typographique (tokens de l'échelle `--font-size-*`), graisse, couleur (tokens), alignement.
- Règle : **pas de valeurs arbitraires par défaut** ; les valeurs custom sont possibles mais marquées ⚠ « hors token » (et remontées dans Dev Mode).

#### 6.2.5 Panneau droit — onglet Inspect (Dev Mode, aussi pour l'owner)
- Nom du node + badge : `Composant Digi` / `Template back` / `Conteneur` / ⚠ `Valeurs hors tokens`.
- **Composant** : `DigiButton` · import `import { DigiButton } from 'digicomponents'` (copier) · lien vers le fichier source dans orchestration (GitHub URL avec le sha synchronisé).
- **Props** : TanStack Table `prop | valeur | défaut | type` (seulement les overrides en gras).
- **Box model** : schéma margin/border/padding/content avec valeurs (comme Figma).
- **Layout** : `display:flex; flex-direction:column; gap: var(--spacing-md) /* 16px */` — liste ou code, **CSS | Tailwind | SCSS** (`$spacing-md`).
- **Tokens utilisés** : couleur (swatch + nom token + valeur HSL/hex), typographie, radius, spacing.
- **Snippet React** du sous-arbre sélectionné (généré depuis le JSON, formatté, copiable).
- **Assets** : images exportables (PNG de la frame / du node, via capture de l'iframe) ❓V1.1.

#### 6.2.6 Panneau History
- Liste chronologique : versions nommées (épinglées, ⭐), versions auto « Prompt : … » (avec extrait du prompt), autosaves groupés (« 6 autosaves »).
- Clic = prévisualiser (canvas en lecture + bandeau « Vous regardez la version du 24/09 14:05 — Restaurer / Revenir »).
- « + » = nommer la version courante. Restaurer = crée une nouvelle version (jamais de destruction).
- Diff visuel ❓V1.1 (liste des nodes ajoutés/modifiés/supprimés en V1).

### 6.3 Vue partagée `/share/$token`
Même éditeur en mode lecture : pas d'onglet AI, pas d'onglet Design, toolbar réduite (Move, Hand, Preview), panneau droit = Inspect. Bandeau discret « Digit AI Studio · lecture seule · version du … ». Lien expirable / révocable.

### 6.4 Settings `/settings`
- **Claude** : champ token (`claude setup-token`), bouton « Tester la connexion », modèle par défaut, statut (valide / expiré), date d'ajout. Stocké chiffré (AES-256-GCM, clé `ENCRYPTION_KEY` env).
- **Usage** (TanStack Charts) : générations/jour, tokens in/out par jour, durée moyenne, top composants utilisés.
- **Librairie** : version synchronisée (sha orchestration, date), nb composants, lien vers le changelog de la dernière sync.
- **Partages** : TanStack Table des liens actifs (maquette, créé le, vues, révoquer).
- **Prompt système** : zone éditable pour ajouter des règles maison (ex. conventions microcopy) — ❓

---

## 7. Modèle de document (source de vérité)
```ts
type MockupDoc = {
  schemaVersion: 1
  libVersion: string            // sha orchestration du manifest utilisé
  pages: Page[]
}
type Page = { id: string; name: string; background: string; frames: FrameNode[] }

type FrameNode = {
  id: string; type: 'Frame'; name: string
  x: number; y: number; width: number; height: number | 'hug'
  preset?: 'desktop'|'laptop'|'tablet'|'mobile'
  theme?: 'light'|'dark'
  children: Node[]
}

type Node = ComponentNode | TemplateNode | BoxNode | TextNode | ImageNode

type Base = {
  id: string                    // nanoid, stable
  name?: string
  hidden?: boolean; locked?: boolean
  layout?: SelfLayout           // comment ce node se dimensionne dans son parent
}
type SelfLayout = {
  width?: { mode: 'fixed'|'hug'|'fill'; value?: number }
  height?: { mode: 'fixed'|'hug'|'fill'; value?: number }
  minW?: number; maxW?: number; alignSelf?: 'start'|'center'|'end'|'stretch'
  position?: 'flow' | { x: number; y: number }   // absolu dans la frame
}
type AutoLayout = {
  direction: 'column'|'row'; wrap?: boolean
  gap: Token<'spacing'> | number | 'auto'
  padding: [Tok, Tok, Tok, Tok]
  justify: 'start'|'center'|'end'|'between'; align: 'start'|'center'|'end'|'stretch'
}
type ComponentNode = Base & {
  type: 'component'; component: string        // 'DigiButton'
  props: Record<string, Json>
  slots?: Record<string, Node[]>              // 'default', 'actions', ...
  text?: string                               // raccourci pour le slot default textuel
}
type TemplateNode = Base & {
  type: 'template'; template: string          // 'EventLayout'
  props: Record<string, Json>
  slots: Record<string, Node[]>               // 'content', 'header-left', ...
}
type BoxNode = Base & { type: 'box'; autoLayout: AutoLayout; style?: BoxStyle; children: Node[] }
type TextNode = Base & { type: 'text'; content: string; textStyle: Token<'text'>; color?: Token<'color'>; weight?: 400|500|600|700 }
type ImageNode = Base & { type: 'image'; src: string; fit: 'cover'|'contain'; radius?: Tok }
type Token<K> = { token: string }   // ex { token: 'spacing-md' } ; valeur brute possible → flag "off-token"
```
Règles :
- Le doc est **validé par Zod** à chaque écriture (server et client) + validation des props contre le manifest (props inconnues rejetées, enums vérifiés).
- Stockage : `mockups.doc jsonb`. Patches : format **JSON Patch (RFC 6902)** ou patches immer → réutilisés pour undo/redo, versions, streaming IA.
- Migration : `schemaVersion` + fonctions de migration si le format évolue ; `libVersion` permet de signaler les maquettes créées avec une ancienne lib.

❓ Faut-il des **composants locaux réutilisables** (un groupe de nodes sauvegardé comme « mon composant ») en V1 ?

---

## 8. Renderer des frames (iframes)
- Le build Vite de `renderer/` produit une iframe de même origine avec un bridge `postMessage` vérifiant l’origine.
- `renderer/src/App.vue` conserve le shell Vue et le bridge ; `renderer/src/ReactRenderFrame.tsx` rend l’arbre de maquette avec React.
- `@digit-ai-studio/digicomponents-react` exporte un wrapper React typé pour chaque composant du manifest. La sync génère leurs arbres depuis les snapshots SSR de la bibliothèque Vue d’Orchestration et copie `style.css`.
- `component` → arbre React issu du snapshot, props textuelles/variantes remplacées, slots remplis par les enfants de la maquette ; styles et dimensions d’instance appliqués au nœud racine.
- `element` → balise HTML React avec attributs et styles filtrés ; les autres nodes (box, texte, image) sont rendus en éléments React.
- Les composants qui exigent un contexte parent doivent être composés par une recette ; leurs snapshots isolés peuvent échouer. Les interactions métier internes à Vue demandent encore une implémentation React dédiée.
- **Stubs du shell back** : `vue-router` en memory history avec routes factices, `vue-i18n` avec les vraies traductions FR (copiées par le skill depuis `lib/digi18n`) — ❓ confirmer où vivent les traductions ; stores Pinia mockés (événement fictif « Salon Digitevent 2026 », user « Nicolas »), SDK API remplacé par un mock.
- Mode édition : overlay transparent capture les pointer events → hit-testing par `document.elementsFromPoint` puis remontée au `data-editor-node` le plus proche. Mode preview : handlers React exposés ; l’état métier des composants Vue reste à porter.
- Taille : la frame force `width` ; hauteur `hug` → le renderer renvoie sa hauteur de contenu (ResizeObserver).

### 8.1 Protocole bridge (postMessage)
Shell → iframe :
- `init { frameId, doc: FrameNode, theme, mode: 'edit'|'preview' }`
- `patch { ops }` (ou `replace { frame }` au début)
- `highlight { hoverId, selectedIds }` (si on veut des outlines dans l'iframe — sinon overlay shell)
- `measure { nodeIds }`
Iframe → shell :
- `ready`, `rendered { contentHeight }`
- `rects { [nodeId]: DOMRect }` (après chaque rendu + resize, throttlé)
- `pointer { type: 'hover'|'click'|'dblclick', nodeId, shift, meta, alt }`
- `textCommit { nodeId, field, value }`
- `computed { nodeId, styles }` (styles calculés pour Dev Mode : padding réel, font-size réel, couleurs)
- `error { nodeId, message }` (composant qui plante → node affiché en rouge avec message, le reste continue — error boundary Vue par node)

---

## 9. Manifest & skill `sync-digicomponents`
### 9.1 Contenu du manifest (`manifest/manifest.json`)
```jsonc
{
  "orchestrationSha": "abc123", "syncedAt": "2026-09-24T10:00:00Z",
  "components": [{
    "name": "DigiButton", "category": "Actions", "file": "lib/digicomponents/src/components/ui/button/DigiButton.vue",
    "description": "…(JSDoc ou 1re phrase de la story)",
    "props": [{ "name": "variant", "type": "'default'|'secondary'|'destructive'|'ghost'|'link'", "default": "default", "required": false }],
    "slots": [{ "name": "default" }], "events": ["click"],
    "examples": [{ "title": "Primary", "doc": { /* nodes JSON dérivés de la story */ } }],
    "aiNotes": "Utiliser pour l'action principale d'une page. Max 1 bouton primary par zone."
  }],
  "templates": [{ "name": "EventLayout", "source": "back", "slots": ["content", "header-left"], "props": [...], "preview": "…" }],
  "tokens": {
    "color": { "primary": "229 100% 48%", ... },
    "spacing": { "spacing-xs": "4px", "spacing-md": "16px", ... },
    "radius": {...}, "text": { "text-sm": {"size": "…", "lineHeight": "…"} }, "shadow": {...}
  }
}
```
- Props/slots/events extraits via **`vue-component-meta`** sur les `.vue` (types TS résolus).
- Exemples : parse des `*.story.vue` (Histoire) → conversion best-effort en nodes JSON ; sinon le code de la story est gardé brut en `exampleCode` pour l'IA.
- `aiNotes` : fichier éditable à la main `manifest/ai-notes.yaml` fusionné à chaque sync (les règles d'usage que je veux imposer à l'IA). Non écrasé.
- Tokens parsés depuis `main.css` (`:root` et `.dark`).

### 9.2 Étapes du skill
1. Vérifier `../orchestration` propre, `git pull` (option), noter le sha.
2. `pnpm --filter digicomponents build` (+ `scripts/build-deps.sh` si nécessaire).
3. Copier `dist/` → `renderer/vendor/digicomponents/`.
4. Copier/transformer les fichiers shell listés dans `manifest/shell-files.json` → `renderer/vendor/shell/` (réécriture des imports vers les stubs).
5. Générer le manifest + registry TS du renderer (`renderer/src/registry.generated.ts`) + types (`src/generated/components.d.ts`) pour l'inspecteur.
6. Diff vs manifest précédent → `manifest/CHANGELOG.md` (ajouts, suppressions, props renommées).
7. Valider toutes les maquettes en base (script `pnpm validate:mockups` contre la DB de prod en lecture) → rapport des nodes cassés.
8. `pnpm build` du renderer + du studio, smoke test (rendu de chaque composant avec ses exemples dans un navigateur headless → capture d'une planche « tous les composants »).
9. Proposer le commit ; deploy = push sur `main` (Railway auto-deploy).

❓ Le studio doit-il afficher une page « Librairie » (planche de tous les composants rendus) — utile pour vérifier la sync visuellement ?

---

## 10. Agent IA
### 10.1 Exécution
- Serveur (TanStack Start server function / route streaming) utilise **Claude Agent SDK** (`@anthropic-ai/claude-agent-sdk`) avec `CLAUDE_CODE_OAUTH_TOKEN` = token déchiffré des Settings. À vérifier à l'implémentation : doc Agent SDK actuelle (context7) — modes d'auth supportés et outils custom via MCP in-process (`createSdkMcpServer`).
- Outils built-in de l'Agent SDK (Bash, Edit, Read…) **désactivés** : l'agent n'a que nos outils.
- Modèle par défaut : Opus (modèle le plus récent dispo sur l'abonnement), Sonnet sélectionnable pour les micro-corrections rapides.
- Streaming SSE vers le client : `text-delta`, `reasoning`, `tool-call`, `tool-result`, `doc-patch`, `done { versionId, usage }`.
- Stop : annule la requête ; les patches déjà appliqués restent (et sont dans une version « interrompue »).

### 10.2 Contexte envoyé
- System prompt : rôle (« designer produit Digitevent »), règles (composants Digi et templates uniquement, tokens uniquement, FR, microcopy Digitevent, 1 action primaire par zone, pas d'inventer de composants → utiliser `box` + `text` + note), + `ai-notes`.
- **Catalogue compact** du manifest (nom + 1 ligne + props principales) — le détail via l'outil `get_component_doc` pour ne pas exploser le contexte. Prompt caching sur ce bloc.
- État : arbre de la maquette **résumé** (id, type, name, props clés) ; si sélection → sous-arbre complet de la sélection.
- Historique du chat de la maquette (tronqué/résumé au-delà de N tours).
- Images jointes (base64, max 5, redimensionnées ≤ 2000px).

### 10.3 Outils (MCP in-process)
| Outil | Rôle |
|---|---|
| `list_components(query?, category?)` | recherche dans le manifest |
| `get_component_doc(name)` | props, slots, exemples, aiNotes |
| `list_templates()` / `get_template_doc(name)` | shell back |
| `list_tokens(kind)` | tokens dispo |
| `get_tree(nodeId?, depth?)` | lire l'arbre |
| `create_frame(name, preset, x?, y?)` | nouvelle frame |
| `insert_node(parentId, slot?, index?, node)` | insère un sous-arbre (validé Zod + manifest ; erreur explicite renvoyée à l'agent si invalide) |
| `update_node(nodeId, {props?, layout?, autoLayout?, style?, text?, name?})` | merge partiel |
| `replace_node(nodeId, node)` | remplace un sous-arbre |
| `move_node(nodeId, newParentId, slot?, index)` | déplacer |
| `delete_node(nodeId)` | supprimer |
| `duplicate_node(nodeId)` | dupliquer |
| `screenshot_frame(frameId)` | ❓ renvoie une capture rendue à l'agent pour auto-vérification (compare avec l'image cible). Nécessite rendu headless côté serveur (Playwright) → V1.1 ? |

- **Scope** : si une sélection est active, les outils d'écriture refusent les nodes hors du sous-arbre sélectionné (sauf si je dis « toute la page »).
- Chaque tool call d'écriture → patch appliqué sur la copie serveur, persisté en fin de tour, poussé en live au client.

### 10.4 Qualité / garde-fous
- Validation stricte → l'agent corrige lui-même ses erreurs (boucle d'outils).
- Limite de tours d'outils par prompt (ex. 60) et timeout (10 min).
- Données fictives réalistes Digitevent (noms d'invités, événements, statuts « Inscrit / En attente / Refusé »).

❓ Politique quand l'image demande un composant inexistant : approximer silencieusement ou lister « composants manquants » en fin de réponse (recommandé : lister) ?

---

## 11. Stack & usage TanStack
| Besoin | Outil |
|---|---|
| Framework, routing, SSR, server functions | **TanStack Start / Router** (déjà en place) |
| Données serveur (projets, maquettes, versions, partages, settings, usage), mutations optimistes, autosave | **TanStack Query** |
| État éditeur : doc courant, sélection, hover, viewport (zoom/pan), outil actif, undo/redo stack, état du stream IA | **TanStack Store** (+ immer pour les patches) |
| Inspecteur (props dynamiques depuis manifest), Settings, dialogues (nouvelle maquette, share) | **TanStack Form** (+ Zod) |
| Liste maquettes (vue liste), Dev Mode props/tokens, Settings partages | **TanStack Table** |
| Stats d'usage dans Settings | **TanStack Charts** (vérifier le package officiel à l'install, sinon proposer l'alternative) |
| Rendu markdown du chat / specs collées | **TanStack Markdown** (idem, vérifier ; fallback `react-markdown`) |
| Virtualisation de l'arbre de layers si gros | TanStack Virtual |
| Raccourcis clavier | TanStack Hotkeys si dispo, sinon `tinykeys` |
| UI shell | shadcn (Base UI) + Tailwind 4 + Remix Icon, thème Digit UI |
| Auth | **Better Auth** (email/password, admin plugin, Google domaine optionnel, adapter Drizzle, helper TanStack Start + `beforeLoad` pour protéger les routes) — vérifier la doc courante via context7 à l'install |
| DB | Postgres (Railway) + **Drizzle** |
| Validation | Zod |
| IA | Claude Agent SDK |
| Renderer des frames | React 19 + Vite ; shell de bridge Vue 3 ; snapshots générés depuis digicomponents Orchestration |

Monorepo pnpm dans `digitAiStudio` : `apps/studio` (actuel) + `apps/renderer` ? ou dossier `renderer/` simple — **reco : pnpm workspace** (`studio`, `renderer`, `packages/doc-schema` partagé Zod + types, `packages/manifest`).

---

## 12. Données (Drizzle)
```
-- tables Better Auth (générées par `@better-auth/cli generate` → schéma Drizzle)
user, session, account, verification   (+ user.role via admin plugin)

projects      (id, owner_id → user.id, name, created_at, updated_at, deleted_at)
mockups       (id, project_id, name, doc jsonb, lib_version, thumbnail_url, created_at, updated_at, deleted_at)
versions      (id, mockup_id, doc jsonb, kind: 'auto'|'prompt'|'named'|'restore', label, prompt_excerpt, created_at)
messages      (id, mockup_id, role, content jsonb /* texte, images, tool calls */, version_id, usage jsonb, created_at)
share_links   (id, mockup_id, token unique, version_id nullable /* null = latest */, expires_at, revoked_at, views, created_at)
settings      (user_id → user.id, key, value_encrypted, updated_at)      -- claude_token, default_model, system_prompt_extra (par user → prêt pour multi-éditeurs)
assets        (id, mockup_id, kind: 'upload'|'thumbnail', url, created_at)   -- images (volume Railway ou bucket Railway)
usage_events  (id, mockup_id, model, input_tokens, output_tokens, duration_ms, created_at)
```
- Autosave : debounce 1,5 s → `PATCH mockups.doc` ; version `auto` au plus toutes les 5 min si changements ; version `prompt` à chaque fin de tour IA.
- Images uploadées & thumbnails : **Railway Bucket** (S3-compatible).

---

## 13. Sécurité
- Sessions : **Better Auth** (cookie httpOnly, sessions en DB, rate limiting intégré). Les routes d'écriture et d'IA vérifient `session.user.role === 'owner'` : côté router via `beforeLoad`, côté serveur via un middleware de server function. L'inscription publique est désactivée.
- Token Claude : jamais renvoyé au client après saisie (affiché masqué), chiffré en base, utilisé uniquement côté serveur. Usage perso uniquement (conformité conditions Anthropic : pas d'ouverture de la génération à d'autres avec ce token).
- Share tokens : 32 octets aléatoires, révocables, expiration optionnelle, lecture seule stricte côté API.
- Iframes : même origine, `postMessage` avec vérif `event.origin` + `frameId`. Contenu = composants maison uniquement (pas de code arbitraire exécuté).
- Uploads : types image uniquement, taille max 10 Mo.

## 14. Infra & release
- Railway : 1 service (Start SSR + statique renderer), Postgres, Bucket. Variables : `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, (`GOOGLE_CLIENT_ID/SECRET` si Google), `ENCRYPTION_KEY`, `BUCKET_*`.
- Deploy auto sur push `main`. Release = sync lib + commit + push. Tag git `lib-<sha>`.
- Healthcheck `/api/health` (DB + renderer présent + manifest chargé).

---

## 15. Jalons
| # | Jalon | Livrable / critère d'acceptation |
|---|---|---|
| M0 | **Spike renderer** | Iframe Vue affiche un arbre JSON en dur avec `EventLayout` + `DigiTable` + `DigiButton`, visuellement identique à `back`. Valide la faisabilité des stubs shell. |
| M1 | Skill sync + manifest | `/sync-digicomponents` produit manifest + registry ; planche de tous les composants rendus sans erreur. |
| M2 | Socle app | Workspace pnpm, Drizzle + Railway Postgres, Better Auth (seed owner, routes protégées), Recents (grille + Table), CRUD projets/maquettes. |
| M3 | Éditeur statique | Canvas zoom/pan, frames multiples, sélection via bridge, overlay, layers (sélection, réordonner, masquer), inspecteur Design (auto-layout, taille, props), undo/redo, autosave. |
| M4 | IA | Settings token, agent + outils, streaming chat Markdown, patches live, scope sélection, image input. |
| M5 | Versions & partage | History, restauration, share links, `/share/$token`, Dev Mode Inspect complet (props, box model, tokens, snippet React). |
| M6 | Polish & prod | Thumbnails, usage Charts, raccourcis, preview mode, deploy Railway, doc d'usage. |

## 16. Risques
| Risque | Impact | Mitigation |
|---|---|---|
| Shell `back` trop couplé (router, stores, API, i18n) | fidélité | M0 en premier ; stubs ; au pire recréer le shell comme templates dans le studio à partir des primitives Digi |
| `vue-component-meta` rate des props (types complexes) | inspecteur incomplet | fallback éditeur JSON ; `ai-notes` manuels |
| Token d'abonnement : limites de débit / changement de politique | génération bloquée | Settings accepte aussi une clé API (switch) ❓ |
| Perf avec beaucoup de frames/iframes | canvas lent | iframes hors viewport « gelées » (capture image à la place), virtualisation |
| Qualité IA sur reproduction d'image | frustration | exemples tirés des stories, outil screenshot d'auto-vérif (V1.1), overlay de comparaison |
| Dérive entre maquettes et nouvelle version de la lib | maquettes cassées | `libVersion` par maquette + validation au sync + rapport |

## 17. Questions ouvertes (récap)
1. Overlay de l'image de référence sur la frame : V1 ou V1.1 ?
2. Plusieurs pages par maquette dès V1 ?
3. Composants locaux réutilisables (groupe sauvegardé) en V1 ?
4. Où vivent les traductions FR utilisées par le shell (`lib/digi18n` ?) → à vérifier.
5. Page « Librairie » (planche de composants) dans le studio ?
6. Outil `screenshot_frame` d'auto-vérification IA (nécessite Playwright serveur) : V1 ou V1.1 ?
7. Composant manquant : lister en fin de réponse (reco) ou approximer silencieusement ?
8. Fallback clé API Anthropic dans Settings en plus du token d'abonnement ?
9. Prompt système éditable dans Settings ?
10. Commentaires sur la maquette (devs → toi) : V2 ?
12. Better Auth : ajouter le login Google `@digitevent.com` pour les devs dès la V1 (en plus des liens de partage) ?
11. Thème dark des maquettes (tokens `.dark` existent) : exposer un toggle par frame ?

## 18. Vérification end-to-end (quand implémenté)
- `pnpm dev` → login → nouvelle maquette → prompt « page liste des participants d'un événement avec relance des non-répondants » → EventLayout + table + bouton rendus, identiques à `back` (comparaison visuelle côte à côte avec l'app locale d'orchestration).
- Sélection d'un conteneur → gap 24→16 dans l'inspecteur → iframe mise à jour, overlay rose du gap correct, undo ⌘Z revient.
- Prompt avec sélection → seul le sous-arbre change (diff de versions).
- Coller une capture → reproduction avec composants Digi, liste des composants manquants.
- `/share/<token>` en navigation privée → lecture seule, Inspect affiche composant, import, props, tokens, snippet.
- Skill sync après modif d'un composant dans orchestration → CHANGELOG manifest + nouvelle prop visible dans l'inspecteur après deploy.
- Railway : deploy, `/api/health` OK, génération en prod OK (logs via MCP Railway).
