# Validation des interactions de maquette

## Régression « Maximum update depth exceeded »

Le problème a été reproduit dans la maquette avec l’inspecteur complet. La
dépendance `orpc.mockups.list` de l’effet d’autosauvegarde était un proxy recréé à
chaque accès. Chaque rendu réinitialisait la file de sauvegarde et relisait le
brouillon local ; `setRecovery` déclenchait le rendu suivant. `SelectRoot`
apparaissait dans la pile sans être à l’origine de la boucle.

L’effet dépend désormais de l’objet racine ORPC stable. Les tests utilisent le
véritable proxy, StrictMode et l’inspecteur complet. Ils échouaient avant le
correctif et vérifient maintenant les déplacements répétés, la récupération et
une unique sauvegarde après validation de la transaction.

Le serveur Vite a été redémarré avec `--force`. Ce nettoyage seul ne corrigeait
pas la boucle. Après correction, les déplacements répétés dans la maquette
ouverte n’ont produit aucune nouvelle erreur React.

## Sauvegarde optimiste

Le dépôt valide immédiatement le document local. La file de sauvegarde sérialise
les requêtes en arrière-plan sans remplacer ce document à leur retour. Des tests
couvrent une première sauvegarde lente suivie d’un nouveau dépôt, puis un succès,
une erreur réseau ou un conflit : la dernière position et son brouillon restent
conservés dans les trois cas.

Une revalidation tardive du loader ne remonte plus une session éditable et ne
réinitialise pas sa référence d’autosauvegarde. Les nouvelles versions distantes
sont signalées ; elles ne remplacent pas automatiquement un document en édition.
La lecture seule conserve son actualisation distante.

L’édition depuis l’inspecteur est aussi testée sur `DigiButton` : texte, propriété
booléenne, fond et largeur sont transmis au renderer Vue sans attendre le serveur.

## Banc de mesure local

```sh
pnpm build:renderer
node scripts/verification/canvas-benchmark.mjs
```

Ouvrir `http://127.0.0.1:3403/`, attendre le chargement des six frames puis cliquer
sur « Mesurer 600 éléments ». Cette fixture ne sauvegarde aucune donnée.

La mesure enchaîne 120 événements de molette, 120 événements de zoom puis 120
aperçus de géométrie. Les événements sont synthétiques ; les aperçus empruntent
le protocole réel vers les composants Vue. La fréquence affichée mesure les
intervalles `requestAnimationFrame`, pas un profil complet du GPU. Les glissements
avec capture réelle doivent aussi être essayés manuellement dans cette fixture.

Résultat du 25 septembre 2026, navigateur intégré Chromium 153 sur ce Mac :

| Indicateur | Résultat |
| --- | --- |
| Frames / éléments | 6 / 600 |
| Fréquence moyenne RAF | 119 Hz |
| Intervalle au 95e percentile | 9,3 ms |
| Intervalles supérieurs à 50 ms | 0 |
| Écritures du document pendant la mesure | 0 |
| Renvois complets aux iframes | 0 |
| Messages de géométrie | 121, fin d’aperçu comprise |
| Erreurs JavaScript | 0 |

Ce résultat ne constitue pas une comparaison avant/après ni une validation
Safari. Ces deux mesures restent à effectuer.

## Vérifications reproductibles

```sh
pnpm test src/features/editor src/features/mockups --maxWorkers=2
pnpm typecheck
pnpm build
```

Les tests couvrent notamment les événements du contrôleur, la validation unique,
l’annulation, la duplication, les contraintes Shift/Alt, la navigation, la lecture
seule, les menus de l’inspecteur pendant les changements de sélection, les
messages périmés et le regroupement des aperçus par rafraîchissement.

Pour la vérification manuelle, essayer Espace + glisser, bouton central, molette,
pincement physique, Ctrl/Cmd + molette, relâchement hors canvas, Échap, perte de
focus, duplication Alt, redimensionnement Shift/Alt et annuler/rétablir. Vérifier
aussi les éléments en auto-layout et le recalcul du texte pendant le resize.
