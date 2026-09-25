# Consignes de développement

## Composants et organisation du code

- Concevoir les composants pour qu’ils soient réutilisables : définir des props typées, explicites et limitées aux besoins du composant. Préférer la composition à un composant trop lié à un seul écran ou à un cas d’usage.
- Mettre chaque composant écrit pour le projet dans son propre fichier et n’y déclarer qu’une seule fonction nommée, exportée sous la forme `export function NomDuComposant(...)`. Les fichiers générés par shadcn dans `src/components/ui/` restent conformes à la structure fournie par shadcn.
- Ne pas ajouter d’autres déclarations `function` dans ce fichier. Pour la logique locale, privilégier des constantes (`const`), notamment des expressions fléchées pour les petits calculs et callbacks. Extraire la logique réutilisée dans un fichier dédié.
- Garder les composants faciles à lire : séparer les responsabilités et extraire les sous-composants réutilisables plutôt que d’accumuler la logique et le rendu dans une seule fonction.
- Utiliser TypeScript pour typer les props, les retours et les données manipulées ; éviter `any` quand un type précis peut être défini.

## Architecture des pages

- Garder `src/routes/` dédié au routage TanStack : définition des routes, paramètres d’URL et chargement des données liés à la route. Une route doit déléguer son affichage à une page dédiée, pas contenir toute l’interface.
- Organiser chaque page dans son propre dossier sous `src/pages/`. Le composant principal de la page se trouve à la racine de ce dossier ; les composants utilisés uniquement par cette page restent dans son sous-dossier `components/`.
- Placer les composants génériques réutilisés entre plusieurs pages dans `src/components/shared/`. Pour un composant global lié à un domaine précis, utiliser un dossier dédié sous `src/components/<domaine>/` (par exemple `src/components/workspace/`). Garder `src/components/ui/` pour les primitives UI générées ou gérées par shadcn/ui.
- Regrouper la logique métier réutilisée par plusieurs pages dans `src/features/<domaine>/`. Éviter de dupliquer cette logique dans les pages ou les composants.
- Ne créer des sous-dossiers (`hooks/`, `lib/`, `types/`, etc.) que lorsqu’ils contiennent effectivement plusieurs éléments qui le justifient ; garder une arborescence simple et prévisible.

## Nommage des fichiers

- Ne pas répéter dans le nom d’un fichier le contexte déjà donné par son dossier parent. Par exemple, dans `src/pages/site-editor/`, préférer `page.tsx`, `components/Sidebar.tsx` et `hooks/usePage.ts` à `SiteEditorPage.tsx`, `SiteEditorSidebar.tsx` et `useSiteEditorPage.ts`.
- Appliquer la même règle aux dossiers de domaine, par exemple `src/features/sites/use-editor.ts` et `use-chat.ts` plutôt que `use-site-editor.ts` et `use-site-chat.ts`.
- Garder un préfixe de domaine seulement lorsqu’il apporte une distinction utile hors du dossier courant.

Exemple d’organisation :

```text
src/
  routes/
    index.tsx                 # branche la route / sur HomePage
    m.$mockupId.tsx           # branche la route maquette sur sa page
  pages/
    home/
      page.tsx
      components/             # composants propres à la page d’accueil
    mockup-editor/
      page.tsx
      components/             # composants propres à l’éditeur
  components/
    shared/                   # composants partagés entre pages
    workspace/                # composants globaux liés à l’espace de travail
      EmptyDialog.tsx
    ui/                       # primitives UI
  features/
    <domaine>/                # logique métier partagée du domaine
```

## Interface avec shadcn/ui

- Utiliser shadcn/ui comme bibliothèque de composants d’interface du projet. Pour les boutons, champs, menus, fenêtres modales et autres contrôles, utiliser le composant shadcn correspondant au lieu de créer une primitive maison ou d’introduire une autre bibliothèque UI.
- Avant d’implémenter un contrôle, vérifier s’il existe déjà dans `src/components/ui/`. S’il manque, l’installer avec `pnpm exec shadcn add <composant>` puis l’importer depuis `@/components/ui/`.
- Construire les composants propres aux pages en composant les primitives shadcn installées. Les wrappers métier sont acceptés s’ils ajoutent une intention ou un comportement propre au produit ; ils ne doivent pas réimplémenter la primitive UI.
- Garder les composants ajoutés par shadcn dans `src/components/ui/`. Pour les variantes et l’apparence, réutiliser leurs props, les tokens et les variables CSS du projet plutôt que de dupliquer le composant.

## Formulaires et validation

- Utiliser TanStack Form (`@tanstack/react-form`) pour gérer les valeurs, les erreurs et la soumission des formulaires, avec des schémas Zod comme validateurs.
- Définir les schémas réutilisables dans `src/features/<domaine>/` et en déduire les types avec `z.input` / `z.infer`. Réutiliser les règles côté client et côté serveur ; toute entrée externe doit être validée avec Zod.
- Appliquer explicitement `schema.parse(value)` lors de la soumission pour récupérer les transformations Zod (trim, normalisation, etc.) : TanStack Form valide les valeurs sans les transformer.
- Composer les champs avec les primitives shadcn et afficher les erreurs près des contrôles avec `aria-invalid` et `aria-describedby`. Préserver les valeurs après un échec et bloquer les doubles envois.

## Animations d’interface

- Suivre la compétence `emil-design-engineering`, notamment `animations.md`, pour les changements d’état et les interactions.
- Réutiliser les tokens `--motion-fast` (120 ms), `--motion-normal` (180 ms), `--motion-dialog` (220 ms), `--motion-ease-out` et `--motion-ease-move`. Synchroniser les éléments associés, notamment une fenêtre et son fond.
- Préférer les transitions CSS pour les contrôles simples et Motion pour les transitions réactives. Garder les indicateurs montés pour interpoler leur opacité plutôt que remplacer brutalement leurs icônes.
- Limiter les déplacements à `transform`/`translate` et les fondus à `opacity` ; éviter `transition: all`, les animations de dimensions et les rebonds décoratifs. Les changements de couleur des contrôles peuvent utiliser une transition courte.
- Ne pas ajouter d’animation d’entrée systématique aux pages, tableaux ou interactions clavier fréquentes. Les états de focus et la saisie restent immédiats.
- Respecter `prefers-reduced-motion` pour chaque animation CSS et JS, y compris les fondus. Les changements de thème ne doivent pas déclencher une transition de toute l’interface.
- Limiter les effets de survol aux appareils qui disposent d’un pointeur précis. Vérifier les changements rapides d’état et la navigation clavier.

## Style de l’inspecteur Dev

- Pour `src/pages/site-editor/components/DevInspector.tsx`, composer l’interface exclusivement avec des classes utilitaires Tailwind. Ne pas ajouter de sélecteur CSS personnalisé ni de classe CSS dédiée dans une feuille de style.
- Ne pas utiliser d’unité `px` dans les valeurs de style. Privilégier l’échelle Tailwind, basée sur `rem`; si une valeur arbitraire est nécessaire, l’exprimer en `rem`.
- Construire les adaptations de mise en page avec les variantes responsives et de conteneur Tailwind (`sm:`, `md:`, `@container`, `@min-*`, etc.) plutôt qu’avec des media queries CSS dédiées.
