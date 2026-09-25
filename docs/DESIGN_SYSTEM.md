# Digit UI

Digit UI fournit les primitives shadcn du projet, des compositions réutilisables et un catalogue interactif sur `/design-system`. Les composants restent dans l’application : aucun package externe ni registre privé n’est nécessaire.

## Référence visuelle

L’application Linear sert de référence principale. Le [récit officiel de la refonte](https://linear.app/now/how-we-redesigned-the-linear-ui) précise l’emploi d’Inter pour les textes et d’Inter Display pour les titres, la hiérarchie des surfaces et la structure de la navigation.

Captures étudiées avec Mobbin :

- [Liste de tâches, thème clair](https://mobbin.com/screens/c61980d9-a5a7-4ccf-aac8-b3ba125e299a).
- [Menu des statuts](https://mobbin.com/screens/d1d26f7d-e1e5-490f-ab4f-c96dd12854c1).
- [Thème sombre](https://mobbin.com/screens/720724d3-f686-457f-8c00-fa7efa409b12).

Les surfaces utilisent des gris neutres. Les couleurs de statut sont limitées aux indicateurs sémantiques, avec une variante monochrome disponible.

## Architecture

| Dossier | Responsabilité |
| --- | --- |
| `src/components/ui/` | Primitives shadcn / Base UI et leurs variantes |
| `src/components/shared/` | Compositions réutilisables entre pages |
| `src/components/design-system/` | Navigation, recherche et aperçu du catalogue |
| `src/components/design-system/examples/` | Démonstrations et source copiable |
| `src/features/design-system/` | Registre, recherche, propriétés et types |
| `src/features/theme/` | Contrat du thème et lecture du cookie côté serveur |
| `src/pages/` | Pages d’affichage |
| `src/routes/` | Routage TanStack, validation des URL et métadonnées |

Chaque composant écrit pour le projet possède son fichier, des props typées et une seule fonction nommée exportée. Les fichiers générés par shadcn suivent leur structure d’origine.

## Typographie et rythme

Les fontes sont servies par l’application, sans appel à un CDN. Le fichier Inter variable contient les axes de graisse et de taille optique. Le texte utilise `opsz: 14` ; les titres utilisent la famille `Inter Display` avec `opsz: 32`.

| Usage | Taille / interligne | Graisse |
| --- | --- | --- |
| Titre de page `.page-title` | 24 / 32 px | 600 |
| Titre de section `.section-title` | 16 / 24 px | 600 |
| Contrôles et listes | 13 / 20 px | 400–500 |
| Métadonnées | 12 / 20 px | 400 |
| Code `.code-source` | 12 / 22 px | 400 |

Contrôle standard : 32 px. Variante compacte : 28 px. Grande variante : 40 px. Sur périphérique tactile, les contrôles concernés disposent d’une hauteur minimale de 44 px. Les rayons usuels vont de 4 à 8 px ; les menus utilisent 8 px.

## Thème

Les valeurs sont centralisées dans `src/styles.css`. Employer les utilitaires sémantiques (`bg-background`, `text-muted-foreground`, `border-border`) au lieu de nouvelles couleurs locales.

| Token | Usage |
| --- | --- |
| `background` / `foreground` | Contenu principal et texte |
| `sidebar` / `sidebar-accent` | Navigation et sélection |
| `surface` / `muted` | Surfaces secondaires et groupes |
| `popover` | Menus et fenêtres |
| `border` / `input` | Séparateurs et champs |
| `ring` | Focus clavier |
| `status-*` | Indicateurs de progression et de résultat |

Le clair est le thème initial. `ThemeProvider` synchronise le contexte React, la classe `.dark` de l’élément HTML et le cookie `digit-ui-theme`. La route racine lit ce cookie avant le rendu serveur pour conserver le thème dès le premier affichage.

La préférence de mouvement réduit est respectée. Les animations utilisent principalement des changements courts d’opacité et de position.

## Primitives et variantes

```tsx
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectGroup, SelectItem,
} from "@/components/ui/select"

export function VisibilityField() {
  const items = [
    { value: "team", label: "Toute l’équipe" },
    { value: "private", label: "Sur invitation" },
  ]

  return (
    <Select items={items} defaultValue="team">
      <SelectTrigger aria-label="Visibilité" variant="ghost" size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
```

`Button` propose `default`, `secondary`, `outline`, `ghost`, `destructive` et `link`. `SelectTrigger` propose `default`, `subtle` et `ghost`, avec les tailles `default` et `sm`.

Les menus utilisent les contrôles shadcn `Select` et `Combobox`. La primitive `native-select` reste un fichier amont installé, mais elle n’est ni employée par l’interface ni proposée dans le catalogue.

Base UI utilise la prop `render` pour composer un déclencheur avec un bouton. Pour un lien, conserver un vrai lien et appliquer `buttonVariants` ; ne pas substituer son rôle par celui d’un bouton.

## Statuts

`StatusIcon` dessine un cercle vectoriel précis : pointillés pour le backlog, contour pour « à faire », portion remplie pour « en cours », cercle coché pour « terminé » et cercle barré pour les annulations.

```tsx
import { StatusIcon } from "@/components/shared/StatusIcon"

<StatusIcon status="in-progress" progress={50} label="En cours, 50 %" />
<StatusIcon status="in-progress" progress={75} tone="neutral" label="75 %" />
<StatusIcon status="done" label="Terminé" />
```

Une icône accompagnée d’un texte est décorative par défaut. Une icône seule doit recevoir `label`.

```tsx
import { useState } from "react"
import { StatusPicker } from "@/components/shared/StatusPicker"
import type { StatusValue } from "@/features/design-system/status"

export function ProjectStatus() {
  const [status, setStatus] = useState<StatusValue>("todo")
  return <StatusPicker value={status} onValueChange={setStatus} />
}
```

Le menu est utilisable avec les flèches et Entrée. Les touches 1 à 6 sélectionnent un statut lorsque le menu est ouvert. Échap le ferme et rend le focus au déclencheur.

## Compositions

Les compositions `PageHeader`, `SearchField`, `FilterBar`, `SettingsSection`, `DatePicker`, `DataTable` et les composants de statut utilisent les primitives existantes. Elles ajoutent une intention ou un comportement, sans recréer les contrôles.

`DataTable` utilise TanStack Table avec filtrage, tri et pagination. Créer les colonnes avec `createColumnHelper<DataTableFeatures, YourRow>()`, puis passer `data`, `columns` et éventuellement `filterColumn`. Les fonctions métier et appels réseau restent dans le parent.

## Ajouter ou modifier un exemple

1. Vérifier si la primitive existe. Sinon : `pnpm exec shadcn add <nom>`.
2. Créer un exemple dans son propre fichier sous `examples/`.
3. Placer ses imports utiles et sa fonction entre `// @example:start` et `// @example:end`.
4. Importer le fichier lui-même avec `?raw`, puis exporter `getCode = createExampleCode(source)` hors de ces marqueurs.
5. Ajouter une entrée typée dans `catalog.ts`, ses variantes réellement supportées et un import dynamique.
6. Documenter les props de composition dans `properties.ts`.

L’aperçu et le code copié proviennent du même fichier. Les réglages sélectionnés sont injectés dans la source : ne pas maintenir un second exemple textuel à côté du vrai composant.

## Vérification

`pnpm test` vérifie les imports et le rendu des exemples, leurs variantes, la syntaxe de la source copiable, les interactions du sélecteur, la recherche, le presse-papiers, le thème et la table de données.

Compléter avec `pnpm typecheck`, `pnpm lint` et `pnpm build`. Pour les changements visuels, vérifier les thèmes clair et sombre, les largeurs mobiles, le focus clavier et les menus dans le navigateur.
