# Inspecteur et barre flottante — audit du 25 septembre 2026

Référence : interface native de Figma Design, fichier « Design Spec ». Périmètre : panneau droit et barre flottante, avec deux modes Design / Dev Mode. Aucun système de prototype ajouté. L’aperçu interactif existant reste disponible.

## Comportements vérifiés

| Domaine | Cas traités | Validation |
| --- | --- | --- |
| Modes | Passage par bouton et Maj+D, répétition clavier ignorée, transaction en cours validée, sélection et zoom conservés, inspecteur rouvert | Tests + navigateur |
| Dev Mode | Sélection directe des descendants, inspection des calques verrouillés, copie et navigation ; mutations, déplacement, redimensionnement, duplication, suppression et undo bloqués | Tests + navigateur |
| Sélection | Vide, simple, multiple, types hétérogènes, parent verrouillé, propriétés communes/mélangées ; synthèse de la sélection multiple en Dev Mode | Tests |
| Saisie numérique | Décimales et virgule, nombres négatifs, expressions + − × ÷ ^ et parenthèses, unités px/%, bornes, valeurs mixtes | Tests + navigateur |
| Validation | Entrée et perte du focus valident ; vide/valeur invalide et Échap restaurent ; une saisie produit une seule entrée d’historique | Tests |
| Incréments | Flèches, Maj ×10, Alt ×0,1, glissement du libellé ; pas de modification derrière un champ, slider ou menu | Tests |
| Historique | Annulation d’une saisie ou d’un Alt-glisser sans perdre la branche de rétablissement ; appui prolongé sur une flèche regroupé | Tests |
| Géométrie | Ratio W/H individuel conservé en sélection multiple, dimensions Hug mesurées, persistance de lockAspectRatio, position visuelle conservée lors du passage en absolu | Tests + navigateur |
| Alignement | Parent pour un calque, limites de sélection pour plusieurs ; Maj-clic aligne le groupe dans son parent ; répartition, historique | Tests |
| Auto layout | Section limitée aux sélections compatibles, padding initialement dissocié s’il diffère, gap Auto affiché explicitement, saisie d’un gap fixe désactive space-between | Tests |
| Couleurs | HEX 3/4/6/8, RGB/HSL/CSS et alpha ; saisie progressive sans expansion parasite, opacité conservée, pourcentages, valeurs invalides | Tests + navigateur |
| Peintures | Valeurs mixtes, alpha modifié sans écraser les couleurs distinctes, ajout/suppression/visibilité, suppression du fond sans réapparition du fond hérité | Tests |
| Propriétés | JSON mixte laissé intact au focus/blur, Échap annule la saisie JSON/texte, propriétés limitées aux composants compatibles | Tests |
| Tokens | Détachement des couleurs ; détachement des longueurs à partir de leur valeur calculée, jamais à zéro par défaut | Tests |
| Canvas | Échap annule le geste et empêche sa reprise au mouvement suivant ; relâcher Espace quitte la main même après un changement de focus | Tests / revue du code |
| Zoom | Limites 5–400 %, rejet de NaN/Infinity, zoom ancré, saisie directe, Maj+0/1/2, Dev Mode | Tests + navigateur |
| Présentation | Inspecteur 240 px par défaut, champs 24 px, îlot 48 px, menus et sélecteur assortis au thème, bordures de sélection vertes en Dev Mode | Navigateur clair/sombre |

Validation finale : **90 tests réussis**, TypeScript React/Vue, ESLint ciblé et build de production.

Les tests ciblés portent sur `src/features/editor/` et `save-queue.test.ts`. La validation visuelle utilise les vrais composants et le renderer dans une fixture en mémoire, sans écraser les documents existants. La dernière vérification de l’application principale atteint la page de connexion. Le compte local de développement affiche « La connexion locale a échoué. Vérifiez que la base de données est démarrée. » : le parcours authentifié complet reste donc non validé. Le build de production complet a abouti.

## Limites de parité à conserver explicites

La comparaison porte sur les fonctions réellement représentées par le document Digit. Elle ne démontre pas une équivalence exhaustive avec tous les objets et outils de Figma : le moteur actuel reste fondé sur des composants Vue, des conteneurs, textes, images et frames.

Ne sont pas implémentés par cette passe : tracés vectoriels/outil plume, rotation, piles de plusieurs remplissages ou effets, dégradés, contraintes avancées, variantes Figma, commentaires/collaboration Figma, exports raster/SVG. L’export de l’application reste JSON. Le bouton de partage copie le lien de la maquette ; il ne crée pas de permissions de partage Figma.

Les commandes d’ajout de peinture sont limitées à une peinture par type, conformément au schéma actuel. Ces limites ne doivent pas être présentées comme des fonctions Figma déjà reproduites.

Références fonctionnelles :
- [Position, dimensions et alignement](https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-position-and-dimensions)
- [Inspection en Dev Mode](https://help.figma.com/hc/en-us/articles/22012921621015-Guide-to-inspecting)
