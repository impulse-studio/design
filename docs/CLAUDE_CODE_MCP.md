# Claude Code et les maquettes du studio

Le studio expose un serveur MCP protégé par Better Auth. Claude Code utilise le compte Digitevent ouvert dans le navigateur ; aucune clé Anthropic ou API du studio n'est nécessaire sur le serveur pour cette connexion.

## Installer la connexion

Après le déploiement de la migration et du site, remplacer `studio.example.com` par le domaine HTTPS défini dans `BETTER_AUTH_URL` :

```sh
claude mcp add --transport http digit-studio https://studio.example.com/api/mcp
claude mcp login digit-studio
```

Claude Code ouvre le navigateur pour la connexion Google et demande d'autoriser la lecture et la modification des maquettes. Dans Claude Code, `/mcp` affiche l'état de la connexion. Utiliser Claude Code 2.1.274 ou une version ultérieure pour le protocole MCP 2026-07-28 utilisé par le serveur.

Donner à Claude Code le lien de la maquette, par exemple : « Modifie cette maquette : https://studio.example.com/m/… ». Il peut lister les maquettes, lire le document et les composants disponibles, puis appliquer directement des opérations. Une révision périmée renvoie un conflit : Claude Code doit relire la maquette avant de réessayer. Les droits de lecture et de modification sont ceux du compte Digitevent.

L'éditeur ouvert détecte les nouvelles révisions environ toutes les 2,5 secondes. En cas de brouillon local, il le conserve et signale le conflit. Les connexions autorisées se retirent depuis **Compte → Connexions MCP**. `claude mcp logout digit-studio` efface également les identifiants conservés par Claude Code sur le PC.

## Déploiement

Exécuter `pnpm db:migrate` avant de lancer la nouvelle version du serveur. Les routes `/.well-known/*`, `/api/auth/*` et `/api/mcp` doivent rester accessibles à travers le proxy HTTPS ; `/api/mcp` refuse les requêtes sans jeton OAuth. Définir `BETTER_AUTH_URL` à l'origine publique exacte du studio.

## Modifier un site React depuis Claude Code

La même connexion MCP peut créer un projet avec `create_project` (`kind: "site"` ou `kind: "mockup"`) et couvre aussi les projets créés avec **Nouveau site**. Donner le lien du projet et la modification voulue, par exemple :

> Sur ce site https://studio.example.com/m/…, le bloc d’accueil ne me va pas. Réduis sa hauteur, mets le bouton à droite et remplace le titre par « Bienvenue à notre événement ». Applique les changements.

Claude Code utilise `list_sites`, `read_site`, puis `apply_site_changes`. `read_site` accepte `mode: "overview"` pour une première lecture légère et `paths` avec `mode: "full"` pour limiter le contenu aux fichiers utiles. L’écriture accepte un résumé, la révision du **site** et des opérations `writeFile` (contenu complet), `replaceInFile` (remplacement exact et unique) ou `deleteFile`, ainsi que les routes si elles changent.

Le serveur valide et compile le projet sans exécuter son code avant d’enregistrer une nouvelle version. Les erreurs de compilation, fichiers protégés, droits insuffisants et révisions périmées empêchent l’écriture. L’éditeur ouvert récupère les nouvelles versions environ toutes les 2,5 secondes et recompile l’aperçu ; une modification locale en cours reste protégée par le contrôle de révision. Les versions précédentes restent restaurables depuis l’historique du site.

Cette édition utilise Claude Code via le MCP du Studio. Après mise à jour du serveur, reconnecter le client MCP si les nouveaux outils n’apparaissent pas. Les nouveaux sites sont générés par la commande officielle create-vite côté serveur ; la compilation a lieu dans le navigateur lors de leur prochaine ouverture.
