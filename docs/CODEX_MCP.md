# Codex et le MCP Digit Studio

Le MCP du Studio permet de lire et modifier les sites React et les maquettes via OAuth. Il est indépendant de l’ancienne intégration de chat décrite dans `CODEX_CHAT.md`.

## Connexion locale

Le Studio doit être lancé sur `http://localhost:3402`. Configurer le serveur une seule fois :

```sh
codex mcp add digit-studio --url http://localhost:3402/api/mcp
```

Utiliser Codex CLI **0.157.0** pour l’authentification :

```sh
pnpm dlx @openai/codex@0.157.0 mcp login digit-studio --oauth-client-registration dcr
```

Ouvrir le lien affiché et autoriser la lecture et la modification dans le Studio. Attendre que la commande confirme la réussite avant de fermer le terminal. La CLI et l’application utilisent la configuration MCP du même hôte ; si les outils ne sont pas actualisés dans une session déjà ouverte, reconnecter le MCP ou relancer l’application.

## Erreur « Authorization server response missing required issuer »

Codex CLI 0.144.6 ne conserve pas le paramètre `iss` lors de la lecture du retour OAuth. Le Studio annonce correctement `authorization_response_iss_parameter_supported: true` et fournit `iss`, mais cette version du client appelle la validation sans lui transmettre sa valeur. Répéter le consentement avec cette version ne corrige pas le problème.

La version 0.157.0 transmet `iss` à `handle_callback_with_issuer`. Ne pas désactiver la validation de l’émetteur ni retirer le champ de découverte côté Studio pour contourner ce défaut du client.

Une erreur `invalid_grant: session not found` sur un ancien jeton nécessite une nouvelle connexion avec le client corrigé.

## Versions du protocole MCP

Le handler utilise `legacy: "stateless"` pour accepter les requêtes Streamable HTTP 2025 de Codex en plus du protocole 2026-07-28. Le mode `legacy: "reject"` provoquait `Unsupported protocol version: 2025-06-18` après une authentification réussie. Les deux protocoles passent par les mêmes contrôles OAuth, consentement et droits d’écriture.

## Parcours rapide

1. Pour partir de zéro, appeler `create_project` avec `kind: "site"` pour un site React ou `kind: "mockup"` pour une maquette Digi. L'outil renvoie le lien et la révision initiale. Si le compte peut créer dans plusieurs équipes, préciser `teamId` indiqué par l'erreur.
2. Pour un projet existant, retrouver son lien avec `list_sites` ou `list_mockups`. Pour un site, appeler `read_site` avec `mode: "overview"`, puis `mode: "full"` et `paths` pour les seuls fichiers à modifier. Pour une maquette, appeler `read_mockup` avec `mode: "overview"` puis `mode: "full"` pour lire l'arbre, et `search_components` avec `includeExamples: true` uniquement pour les composants nécessaires.
3. Appliquer les changements avec `apply_site_changes` ou `apply_mockup_changes` et la révision obtenue. Pour une petite modification de site, `replaceInFile` évite de renvoyer tout le fichier : fournir `path`, `oldText` présent une seule fois et `newText`. Pour créer ou réécrire un fichier, utiliser `writeFile`.
4. Réutiliser la nouvelle révision renvoyée par l'écriture pour l'itération suivante. En cas de conflit, relire le projet avant de réessayer.

Le MCP manipule les fichiers et la structure de maquette. Pour reproduire une image ou une page de référence, fournir aussi cette référence à l'agent MCP ; celui-ci choisit les composants ou écrit le code, puis utilise les outils ci-dessus pour enregistrer le résultat.

Voir la [documentation MCP de Codex](https://developers.openai.com/codex/mcp) et [le fonctionnement des modifications du Studio](CLAUDE_CODE_MCP.md).
