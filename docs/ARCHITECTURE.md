# Organisation du Studio

Le découpage reprend les schémas par domaine, les validateurs dédiés et le contexte d’organisation de `claude-design-v1`, en conservant les features et TanStack du Studio.

## Contrats et types

Les validateurs applicatifs résident dans `src/validators`. Les dossiers sites, bibliothèques, IA, chat et MCP séparent leurs contrats de document, formulaires, requêtes et transport. Les différences entre validation de formulaire et validation API restent explicites : messages, valeurs par défaut et transformations ne sont pas interchangeables.

Les tables Drizzle résident dans `src/db/schema/<domaine>`. L’index central est l’entrée de Drizzle et des consommateurs existants. Les types de ligne nécessaires sont inférés dans les domaines ; `src/db/types.ts` fournit les types de connexion et de transaction.

`src/server/types.ts` expose `RouterInputs` et `RouterOutputs`. Les types de lecture de l’interface se déduisent du routeur dans les features. Les services serveur restent indépendants de ces alias pour éviter les cycles d’inférence. Les états locaux et les documents validés conservent leurs propres contrats.

Les validations de calques, d’éléments, de documents et de compatibilité avec un manifest sont séparées dans le package partagé. Son API publique reste identique et ne dépend pas du Studio.

## Responsabilités

Les routes TanStack chargent les données et branchent une page. Chaque page possède son `page.tsx` et ses composants exclusifs. Les composants utilisés par plusieurs pages restent partagés ou rattachés à un domaine global. Les calculs de géométrie sont séparés des composants qui les affichent.

Les routeurs oRPC assemblent les handlers. Le middleware d’équipe résout le contexte après validation ; les handlers conservent leurs politiques d’autorisation et leurs erreurs publiques. Les bibliothèques séparent accès, orchestration, permissions et persistance. Les transactions restent sous le contrôle du service qui orchestre l’opération.

Les UUID v4 proviennent directement du package `uuid`, conservant le format existant. Le dépôt de référence utilise des ULID : ce format n’est pas repris, car les contrats du Studio attendent des UUID.

## Outillage et compatibilité

Les scripts sont regroupés par développement, bibliothèques, génération et vérification. Les noms des commandes pnpm sont conservés. Les scripts qui calculent la racine du dépôt prennent en compte leur nouveau niveau de dossier.

Le refactoring structurel ne nécessite aucune migration SQL et préserve les noms RPC, les méthodes HTTP, les documents enregistrés et les exports des packages. Les contrôles portent sur le typage des deux applications, les tests de contrats et permissions, les intégrations PostgreSQL, les scripts et la compilation de production.
