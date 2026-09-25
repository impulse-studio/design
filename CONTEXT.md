# Digit AI Studio

Digit AI Studio permet de créer, modifier, prévisualiser et partager des maquettes Digi et des sites dont le rendu reste lié au code réellement livré.

## Language

**Projet**:
Un dossier métier qui regroupe des maquettes liées à une même initiative.
_Avoid_: Site, workspace

**Maquette**:
Un document de conception composé de pages, de frames et de nodes Digi ou HTML.
_Avoid_: Projet, fichier de site

**Site**:
Un projet de code React ou Vue éditable, prévisualisable et exportable de façon autonome.
_Avoid_: Projet, maquette React

**Frame**:
Une surface de rendu dimensionnée dans une maquette.
_Avoid_: Page, viewport

**Node**:
Un élément de l’arbre d’une maquette, tel qu’un élément Digi, HTML, texte, image ou template.
_Avoid_: Calque, composant

**Variante locale**:
Une définition réutilisable propre à une maquette dont les instances peuvent surcharger certaines valeurs.
_Avoid_: Composant global, variante Digi

**Bibliothèque**:
Un ensemble versionné de sources, assets et métadonnées que l’équipe peut installer dans ses sites sans modifier les autres sites.
_Avoid_: Catalogue, manifest

**Manifest**:
La description machine d’une bibliothèque Digi : éléments disponibles, propriétés, slots, exemples et tokens.
_Avoid_: Bibliothèque, registre

**Version**:
Un état durable et restaurable d’une maquette ou d’un site à une révision donnée.
_Avoid_: Sauvegarde, brouillon

**Proposition**:
Un changement préparé par une génération ou un accès MCP, validé avant son application au document courant.
_Avoid_: Version, brouillon

**Conversation**:
L’historique privé des messages et générations d’un utilisateur pour une maquette ou un site.
_Avoid_: Génération, session

**Génération**:
Une exécution bornée qui transforme un message de conversation en réponse et éventuellement en proposition.
_Avoid_: Conversation, worker

**Scénario**:
Un jeu de données nommé qui permet d’observer un site dans un état métier déterminé sans modifier ses sources enregistrées.
_Avoid_: Fixture, version

**Connexion MCP**:
Un consentement révocable qui accorde à un client MCP des permissions déterminées sur le Studio.
_Avoid_: Session utilisateur, jeton
