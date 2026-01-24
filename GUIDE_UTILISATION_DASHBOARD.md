# 📖 GUIDE D'UTILISATION - TABLEAU DE BORD CMS

## 🎯 Introduction

Ce guide vous explique comment utiliser toutes les fonctionnalités du tableau de bord CMS.

---

## 🔐 Connexion

1. Accédez à `/admin/login`
2. Entrez vos identifiants
3. Vous serez redirigé vers le dashboard

**Rôles disponibles :**
- **Admin** : Accès complet
- **Éditeur** : Modification de tous les contenus
- **Auteur** : Gestion de ses propres contenus

---

## 📝 Gestion des Articles

### Créer un article

1. Menu **Articles** → Bouton **Nouvel article**
2. **Choisir un template** parmi :
   - **Standard** : Article classique
   - **Gallery** : Article avec galerie d'images
   - **Video** : Article vidéo (YouTube, Vimeo)
   - **Quote** : Citation avec auteur
   - **Link** : Partage de lien externe
   - **Interview** : Format Q&A
   - **Review** : Critique avec notation
   - **Tutorial** : Guide étape par étape
   - **Case Study** : Étude de cas client
   - **News** : Actualité brève

3. **Remplir les champs** selon le template :
   - Titre et slug
   - Contenu principal
   - Champs spécifiques au template
   - Image de couverture
   - Catégorie
   - Tags SEO

4. **Publier ou sauvegarder en brouillon**

### Exemple : Article Gallery

```
Template: GALLERY
Titre: "Notre Portfolio 2024"
Description: "Découvrez nos plus belles réalisations"
Images: [Ajouter 6-10 images via l'upload]
Légende: Texte sous chaque image
Catégorie: Portfolio
Statut: Publié
```

---

## 📅 Gestion des Événements

### Créer un événement

1. Menu **Événements** → Bouton **Nouvel événement**
2. **Choisir un template** :
   - **Conference** : Conférence avec speakers
   - **Workshop** : Atelier pratique
   - **Webinar** : Webinaire en ligne
   - **Networking** : Événement networking
   - **Concert** : Concert ou spectacle
   - **Exhibition** : Exposition artistique
   - **Festival** : Festival multi-jours
   - **Ceremony** : Cérémonie officielle
   - **Competition** : Compétition/concours
   - **Meetup** : Rencontre communautaire

3. **Informations obligatoires** :
   - Date et heure de début
   - Date et heure de fin
   - Lieu (adresse complète)
   - Capacité maximale

4. **Champs selon template** (ex: Conference) :
   - Liste des speakers
   - Programme des sessions
   - Informations d'inscription

### Exemple : Webinar

```
Template: WEBINAR
Titre: "Formation React Avancé"
Date: 2024-02-15 à 14:00
Durée: 2 heures
Plateforme: Zoom
Lien: https://zoom.us/j/123456789
Capacité: 100 participants
Prérequis: Connaissances React de base
```

---

## 📄 Gestion des Pages

### Créer une page avec template

1. Menu **Pages** → Bouton **Nouvelle page**
2. Cliquez sur **Modèle** pour choisir un template :
   - **Home** : Page d'accueil
   - **About** : À propos
   - **Services** : Présentation services
   - **Contact** : Page de contact
   - **Portfolio** : Galerie de réalisations
   - **Team** : Présentation équipe
   - **Pricing** : Grille tarifaire
   - **FAQ** : Questions fréquentes
   - **Landing** : Page de destination
   - **Blog Home** : Accueil blog

3. Le template applique **automatiquement** les sections
4. **Personnalisez** chaque section :
   - Modifiez les titres
   - Éditez le contenu
   - Changez les types de sections
   - Réorganisez l'ordre

### Types de sections disponibles

- **Hero Banner** : Bannière avec titre et CTA
- **Texte** : Bloc de texte enrichi
- **Image** : Image pleine largeur
- **Galerie** : Grille d'images
- **CTA** : Call to Action
- **Fonctionnalités** : Liste de features
- **Témoignages** : Citations clients
- **Contact** : Formulaire de contact

### Exemple : Page Services

```
Template: Services

Section 1 (Hero):
  Titre: "Nos Services"
  Contenu: "Solutions professionnelles sur mesure"

Section 2 (Texte):
  Titre: "Ce que nous offrons"
  Contenu: [Description détaillée]

Section 3 (Fonctionnalités):
  Feature 1: Consultation
  Feature 2: Développement
  Feature 3: Support

Section 4 (CTA):
  Titre: "Prêt à démarrer ?"
  Bouton: "Contactez-nous"
```

---

## 📁 Gestion des Catégories

### Créer une catégorie

1. Menu **Catégories** → Bouton **Nouvelle catégorie**
2. Remplir le formulaire :
   - **Nom** : ex. "Actualités"
   - **Slug** : généré automatiquement (actualites)
   - **Description** : optionnelle
   - **Type** : Article ou Événement

3. La catégorie apparaît dans les formulaires d'articles/événements

### Organisation recommandée

**Articles :**
- Actualités
- Tutoriels
- Études de cas
- Critiques

**Événements :**
- Conférences
- Ateliers
- Webinaires
- Meetups

---

## 👥 Gestion des Utilisateurs

### Créer un utilisateur

1. Menu **Utilisateurs** → Bouton **Nouvel utilisateur**
2. Informations obligatoires :
   - Nom complet
   - Email (unique)
   - Mot de passe (min 8 caractères)
   - Rôle

3. Informations optionnelles :
   - Téléphone
   - Biographie
   - Photo de profil

### Rôles et permissions

| Fonctionnalité | Author | Editor | Admin |
|----------------|--------|--------|-------|
| Créer contenu | ✅ Ses contenus | ✅ Tous | ✅ Tous |
| Modifier contenu | ✅ Ses contenus | ✅ Tous | ✅ Tous |
| Supprimer contenu | ❌ | ✅ Tous | ✅ Tous |
| Gérer catégories | ❌ | ✅ | ✅ |
| Gérer utilisateurs | ❌ | ❌ | ✅ |
| Modifier paramètres | ❌ | ❌ | ✅ |

### Modifier un utilisateur

- **Email** : Ne peut pas être changé après création
- **Mot de passe** : Laisser vide pour ne pas modifier
- **Rôle** : Peut être changé à tout moment
- **Statut** : Actif/Inactif

---

## ⚙️ Paramètres du Site

### Paramètres Généraux

**Menu : Paramètres → Général**

1. **Identité du site**
   - Nom affiché dans le header
   - Description pour SEO
   - URL principale du site

2. **Contact**
   - Email de contact public
   - Numéro de téléphone

3. **Branding**
   - Logo (PNG transparent, 200x60px)
   - Favicon (ICO/PNG, 32x32px)
   - Texte de copyright (footer)

### Paramètres SEO

**Menu : Paramètres → SEO**

1. **Meta tags par défaut**
   - Meta Title (max 60 caractères)
   - Meta Description (max 160 caractères)
   - Meta Keywords (séparés par virgules)
   - Image Open Graph (1200x630px)

2. **Outils d'analyse**
   - **Google Analytics** : `G-XXXXXXXXXX`
   - **Search Console** : Code de vérification

3. **Paramètres avancés**
   - **robots.txt** : Personnaliser l'accès des robots
   - **Sitemap** : Génération automatique activée/désactivée

**Exemple robots.txt :**
```
User-agent: *
Disallow: /admin/
Disallow: /api/
Allow: /

Sitemap: https://example.com/sitemap.xml
```

### Paramètres d'Intégration

**Menu : Paramètres → Intégrations**

1. **Configuration SMTP** (envoi d'emails)
   ```
   Hôte: smtp.gmail.com
   Port: 587
   User: noreply@example.com
   Password: ••••••••
   From Email: noreply@example.com
   From Name: Mon Site
   ```

2. **Réseaux sociaux**
   - Facebook : `https://facebook.com/monentreprise`
   - Twitter : `https://twitter.com/monentreprise`
   - Instagram : `https://instagram.com/monentreprise`
   - LinkedIn : `https://linkedin.com/company/monentreprise`
   - YouTube : `https://youtube.com/@monentreprise`

3. **Services externes**
   - **Disqus** (commentaires) : shortname du site
   - **Mailchimp** (newsletter) : clé API
   - **Stripe** (paiements) : clé publique

4. **Scripts personnalisés**
   ```html
   <!-- Google Tag Manager -->
   <script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXX');</script>
   ```

---

## 🔍 Fonctionnalités Communes

### Recherche
- Barre de recherche en haut de chaque liste
- Recherche par titre, nom, email selon le contexte
- Résultats instantanés

### Filtres
- **Articles** : Par catégorie, statut, auteur
- **Événements** : Par date, statut, type
- **Utilisateurs** : Par rôle, statut
- **Catégories** : Par type

### Actions en masse
- Sélectionner plusieurs éléments
- Supprimer en masse
- Changer le statut en masse

### Auto-sauvegarde
- Les brouillons sont sauvegardés automatiquement
- Récupération en cas de fermeture accidentelle

---

## 📱 Interface Responsive

Le dashboard s'adapte à tous les écrans :

- **Desktop** (>1024px) : Sidebar fixe
- **Tablet** (768-1023px) : Sidebar repliable
- **Mobile** (<768px) : Menu hamburger

---

## 💡 Conseils et Bonnes Pratiques

### SEO
1. ✅ Toujours remplir le Meta Title et Description
2. ✅ Utiliser des slugs courts et descriptifs
3. ✅ Ajouter un texte Alt à toutes les images
4. ✅ Structurer le contenu avec des titres H1-H6

### Performance
1. ✅ Compresser les images avant upload (<1MB)
2. ✅ Utiliser des formats modernes (WebP)
3. ✅ Limiter le nombre de sections par page (max 10)

### Organisation
1. ✅ Créer des catégories avant les articles
2. ✅ Utiliser des noms de fichiers descriptifs
3. ✅ Organiser la médiathèque en dossiers
4. ✅ Archiver les anciens contenus

### Sécurité
1. ✅ Mots de passe forts (min 12 caractères)
2. ✅ Changer les mots de passe régulièrement
3. ✅ Limiter les rôles admin
4. ✅ Revoir les permissions utilisateurs

---

## 🆘 Résolution de Problèmes

### Impossible de publier un article
- ✅ Vérifier que tous les champs requis sont remplis
- ✅ Vérifier la connexion internet
- ✅ Essayer de sauvegarder en brouillon d'abord

### Image ne s'affiche pas
- ✅ Vérifier le format (JPG, PNG, WebP acceptés)
- ✅ Vérifier la taille (<5MB)
- ✅ Recharger la page

### Template ne s'applique pas
- ✅ Sauvegarder d'abord les modifications en cours
- ✅ Actualiser la page
- ✅ Réessayer l'application du template

### Catégorie n'apparaît pas
- ✅ Vérifier que le type correspond (Article/Événement)
- ✅ Actualiser le formulaire
- ✅ Créer à nouveau la catégorie si nécessaire

---

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@example.com
- 💬 Chat : Bouton en bas à droite
- 📚 Documentation : `/docs`

---

**Version :** 1.0.0  
**Dernière mise à jour :** Janvier 2024
