# Templates pour Articles et Événements

## 📋 Vue d'ensemble

Les templates ont été récupérés depuis le dépôt GitHub https://github.com/epitaphe360/Epitaphe.git et intégrés dans le projet.

## 📝 Templates d'Articles

Le système supporte **10 types de templates d'articles** différents :

### 1. STANDARD (Standard)
- **Description** : Article classique avec texte et images
- **Usage** : Articles de blog traditionnels, contenus éditoriaux
- **Champs** : Titre, contenu, image mise en avant

### 2. GALLERY (Galerie)
- **Description** : Galerie d'images avec captions
- **Usage** : Portfolios, reportages photo, showcases
- **Champs spécifiques** :
  - Liste d'images avec légendes
  - Organisation en galerie

### 3. VIDEO (Vidéo)
- **Description** : Article avec vidéo intégrée
- **Usage** : Tutoriels vidéo, interviews, contenus multimédias
- **Champs spécifiques** :
  - URL de la vidéo
  - Code d'intégration (optionnel)
  - Provider (YouTube, Vimeo, autre)

### 4. QUOTE (Citation)
- **Description** : Citation mise en avant avec auteur
- **Usage** : Citations inspirantes, témoignages
- **Champs spécifiques** :
  - Citation
  - Auteur
  - Titre/Fonction de l'auteur
  - Source

### 5. LINK (Lien)
- **Description** : Partage de lien externe
- **Usage** : Curation de contenu, références
- **Champs spécifiques** :
  - URL du lien
  - Titre du lien
  - Description

### 6. INTERVIEW (Interview)
- **Description** : Format questions/réponses
- **Usage** : Interviews, Q&A
- **Champs spécifiques** :
  - Nom de l'interviewé
  - Titre/Fonction
  - Liste de questions/réponses

### 7. REVIEW (Critique)
- **Description** : Revue avec notation
- **Usage** : Critiques de produits, livres, films, services
- **Champs spécifiques** :
  - Note (sur 10)
  - Points positifs
  - Points négatifs
  - Verdict final

### 8. TUTORIAL (Tutoriel)
- **Description** : Guide étape par étape
- **Usage** : Tutoriels, guides pratiques, how-to
- **Champs spécifiques** :
  - Niveau de difficulté (Débutant, Intermédiaire, Avancé)
  - Durée estimée
  - Prérequis
  - Étapes avec images optionnelles

### 9. CASE_STUDY (Étude de cas)
- **Description** : Analyse de cas client
- **Usage** : Success stories, études de cas business
- **Champs spécifiques** :
  - Nom du client
  - Secteur d'activité
  - Problématique
  - Solution apportée
  - Résultats
  - Métriques clés

### 10. NEWS (Actualité)
- **Description** : Article d'actualité
- **Usage** : News, communiqués de presse
- **Champs spécifiques** :
  - Source
  - Date de l'événement
  - Lieu (optionnel)

---

## 🎪 Templates d'Événements

Le système supporte **10 types de templates d'événements** différents :

### 1. CONFERENCE (Conférence)
- **Description** : Conférence avec speakers
- **Usage** : Conférences professionnelles, talks
- **Champs spécifiques** :
  - Liste des speakers (nom, titre, bio, photo)
  - Agenda détaillé (horaires, titres, speakers)
  - Tracks/Thématiques

### 2. WORKSHOP (Atelier)
- **Description** : Atelier pratique
- **Usage** : Formations pratiques, ateliers hands-on
- **Champs spécifiques** :
  - Formateur (nom et bio)
  - Matériel requis
  - Nombre maximum de participants

### 3. WEBINAR (Webinaire)
- **Description** : Séminaire en ligne
- **Usage** : Formations en ligne, présentations virtuelles
- **Champs spécifiques** :
  - Plateforme (Zoom, Teams, etc.)
  - Lien de la réunion
  - Disponibilité du replay
  - Lien du replay

### 4. NETWORKING (Networking)
- **Description** : Événement de réseautage
- **Usage** : Événements networking, meetups professionnels
- **Champs spécifiques** :
  - Format (speed networking, cocktail, etc.)
  - Public cible
  - Secteurs d'activité

### 5. CONCERT (Concert)
- **Description** : Concert ou spectacle
- **Usage** : Concerts, spectacles musicaux
- **Champs spécifiques** :
  - Salle/Venue
  - Line-up complet
  - Détails des artistes (nom, genre, heure)

### 6. EXHIBITION (Exposition)
- **Description** : Exposition artistique
- **Usage** : Expositions d'art, galeries
- **Champs spécifiques** :
  - Liste des artistes
  - Œuvres exposées (titre, artiste, description)
  - Curateur (optionnel)

### 7. FESTIVAL (Festival)
- **Description** : Festival multi-activités
- **Usage** : Festivals culturels, événements multi-jours
- **Champs spécifiques** :
  - Nombre de jours
  - Programme par jour
  - Partenaires

### 8. CEREMONY (Cérémonie)
- **Description** : Cérémonie officielle
- **Usage** : Cérémonies, événements officiels
- **Champs spécifiques** :
  - Protocole
  - Dress code
  - Invité d'honneur

### 9. COMPETITION (Compétition)
- **Description** : Compétition ou concours
- **Usage** : Concours, compétitions sportives/culturelles
- **Champs spécifiques** :
  - Règlement
  - Prix (rang, récompense)
  - Jury
  - Date limite d'inscription

### 10. MEETUP (Meetup)
- **Description** : Rencontre communautaire
- **Usage** : Meetups tech, rencontres informelles
- **Champs spécifiques** :
  - Thème
  - Sponsors
  - Taille cible

---

## 📦 Fichiers créés

### 1. `/cms-dashboard/types/templates.ts`
Contient :
- Types TypeScript pour tous les templates
- Constantes ARTICLE_TEMPLATES et EVENT_TEMPLATES
- Interfaces pour les données spécifiques à chaque template

### 2. Intégration dans les formulaires
Les templates sont utilisables dans :
- `ArticleForm.tsx` - Création/édition d'articles avec templates
- `EventForm.tsx` - Création/édition d'événements avec templates

---

## 🚀 Utilisation

### Dans le code

```typescript
import { ARTICLE_TEMPLATES, ArticleTemplate } from '@/cms-dashboard/types/templates';
import { EVENT_TEMPLATES, EventTemplate } from '@/cms-dashboard/types/templates';

// Récupérer tous les templates d'articles
const articleTemplates = ARTICLE_TEMPLATES;

// Utiliser un template spécifique
const videoTemplate = ARTICLE_TEMPLATES.find(t => t.value === 'VIDEO');

// Dans un formulaire
<Select
  options={ARTICLE_TEMPLATES.map(t => ({
    value: t.value,
    label: `${t.label} - ${t.description}`
  }))}
/>
```

### Structure des données

```typescript
// Exemple de données pour un article de type VIDEO
{
  title: "Mon tutoriel vidéo",
  template: "VIDEO",
  templateData: {
    videoUrl: "https://youtube.com/watch?v=...",
    provider: "youtube"
  }
}

// Exemple de données pour un événement de type CONFERENCE
{
  title: "Tech Conference 2026",
  template: "CONFERENCE",
  templateData: {
    speakers: [
      { name: "John Doe", title: "CEO", bio: "..." }
    ],
    agenda: [
      { time: "09:00", title: "Keynote", speaker: "John Doe" }
    ],
    tracks: ["AI", "Web3", "Cloud"]
  }
}
```

---

## 🎨 Personnalisation

Les templates peuvent être étendus en :
1. Ajoutant de nouveaux types dans `templates.ts`
2. Créant des interfaces de données correspondantes
3. Ajoutant le rendu dans les composants de formulaire

---

## ✅ Statut

- ✅ Types de templates définis
- ✅ Fichier templates.ts créé
- ✅ 10 templates d'articles disponibles
- ✅ 10 templates d'événements disponibles
- ✅ Interfaces TypeScript complètes
- ⏳ Intégration dans ArticleForm.tsx (à adapter)
- ⏳ Intégration dans EventForm.tsx (à adapter)

---

## 📚 Ressources

- Fichier principal : [templates.ts](cms-dashboard/types/templates.ts)
- Dépôt source : https://github.com/epitaphe360/Epitaphe.git
- Chemin source : `frontend/src/types/templates.ts`
