// ========================================
// Page Templates - Modèles prédéfinis
// ========================================

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  sections: Array<{
    type: string;
    title: string;
    content: string;
    order: number;
  }>;
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: 'home',
    name: 'Page d\'accueil',
    description: 'Structure complète pour une page d\'accueil moderne',
    sections: [
      {
        type: 'hero',
        title: 'Bannière principale',
        content: '<h1>Bienvenue sur notre site</h1><p>Découvrez nos services et solutions</p>',
        order: 0,
      },
      {
        type: 'features',
        title: 'Nos fonctionnalités',
        content: '<p>Découvrez ce qui nous rend unique</p>',
        order: 1,
      },
      {
        type: 'cta',
        title: 'Prêt à commencer ?',
        content: '<p>Contactez-nous dès aujourd\'hui pour en savoir plus</p>',
        order: 2,
      },
    ],
  },
  {
    id: 'about',
    name: 'À propos',
    description: 'Page de présentation de l\'entreprise',
    sections: [
      {
        type: 'hero',
        title: 'Notre histoire',
        content: '<h1>À propos de nous</h1>',
        order: 0,
      },
      {
        type: 'text',
        title: 'Qui sommes-nous',
        content: '<p>Présentez votre entreprise ici...</p>',
        order: 1,
      },
      {
        type: 'features',
        title: 'Nos valeurs',
        content: '<p>Les valeurs qui nous guident</p>',
        order: 2,
      },
      {
        type: 'testimonials',
        title: 'Ce que disent nos clients',
        content: '<p>Témoignages de satisfaction</p>',
        order: 3,
      },
    ],
  },
  {
    id: 'services',
    name: 'Services',
    description: 'Page de présentation des services',
    sections: [
      {
        type: 'hero',
        title: 'Nos services',
        content: '<h1>Découvrez nos services</h1>',
        order: 0,
      },
      {
        type: 'text',
        title: 'Introduction',
        content: '<p>Présentation générale de vos services</p>',
        order: 1,
      },
      {
        type: 'features',
        title: 'Liste des services',
        content: '<p>Détails de chaque service</p>',
        order: 2,
      },
      {
        type: 'cta',
        title: 'Demander un devis',
        content: '<p>Intéressé par nos services ?</p>',
        order: 3,
      },
    ],
  },
  {
    id: 'contact',
    name: 'Contact',
    description: 'Page de contact avec formulaire',
    sections: [
      {
        type: 'hero',
        title: 'Contactez-nous',
        content: '<h1>Entrons en contact</h1>',
        order: 0,
      },
      {
        type: 'contact',
        title: 'Formulaire de contact',
        content: '<p>Remplissez le formulaire ci-dessous</p>',
        order: 1,
      },
    ],
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Page de présentation des réalisations',
    sections: [
      {
        type: 'hero',
        title: 'Nos réalisations',
        content: '<h1>Portfolio</h1>',
        order: 0,
      },
      {
        type: 'gallery',
        title: 'Projets récents',
        content: '<p>Découvrez nos dernières réalisations</p>',
        order: 1,
      },
      {
        type: 'cta',
        title: 'Travaillons ensemble',
        content: '<p>Prêt à démarrer votre projet ?</p>',
        order: 2,
      },
    ],
  },
  {
    id: 'team',
    name: 'Équipe',
    description: 'Page de présentation de l\'équipe',
    sections: [
      {
        type: 'hero',
        title: 'Notre équipe',
        content: '<h1>Rencontrez l\'équipe</h1>',
        order: 0,
      },
      {
        type: 'text',
        title: 'Introduction',
        content: '<p>Présentation de votre équipe</p>',
        order: 1,
      },
      {
        type: 'gallery',
        title: 'Membres de l\'équipe',
        content: '<p>Photos et descriptions des membres</p>',
        order: 2,
      },
    ],
  },
  {
    id: 'pricing',
    name: 'Tarifs',
    description: 'Page de présentation des tarifs',
    sections: [
      {
        type: 'hero',
        title: 'Nos tarifs',
        content: '<h1>Choisissez votre formule</h1>',
        order: 0,
      },
      {
        type: 'features',
        title: 'Plans tarifaires',
        content: '<p>Comparez nos différentes offres</p>',
        order: 1,
      },
      {
        type: 'cta',
        title: 'Commencer maintenant',
        content: '<p>Choisissez votre plan et démarrez</p>',
        order: 2,
      },
    ],
  },
  {
    id: 'faq',
    name: 'FAQ',
    description: 'Page de questions fréquentes',
    sections: [
      {
        type: 'hero',
        title: 'Questions fréquentes',
        content: '<h1>FAQ</h1>',
        order: 0,
      },
      {
        type: 'text',
        title: 'Questions et réponses',
        content: '<p>Trouvez des réponses à vos questions</p>',
        order: 1,
      },
      {
        type: 'cta',
        title: 'Besoin d\'aide ?',
        content: '<p>Contactez notre support</p>',
        order: 2,
      },
    ],
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Page de destination marketing',
    sections: [
      {
        type: 'hero',
        title: 'Offre spéciale',
        content: '<h1>Ne manquez pas cette offre</h1>',
        order: 0,
      },
      {
        type: 'features',
        title: 'Avantages',
        content: '<p>Pourquoi choisir notre offre</p>',
        order: 1,
      },
      {
        type: 'testimonials',
        title: 'Témoignages',
        content: '<p>Ce que disent nos clients</p>',
        order: 2,
      },
      {
        type: 'cta',
        title: 'Offre limitée',
        content: '<p>Profitez-en maintenant</p>',
        order: 3,
      },
    ],
  },
  {
    id: 'blog-home',
    name: 'Accueil Blog',
    description: 'Page d\'accueil pour un blog',
    sections: [
      {
        type: 'hero',
        title: 'Notre blog',
        content: '<h1>Actualités et articles</h1>',
        order: 0,
      },
      {
        type: 'text',
        title: 'Articles récents',
        content: '<p>Découvrez nos derniers articles</p>',
        order: 1,
      },
    ],
  },
];

export const getTemplateById = (id: string): PageTemplate | undefined => {
  return PAGE_TEMPLATES.find((t) => t.id === id);
};
