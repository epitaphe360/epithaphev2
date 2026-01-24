export interface SolutionItem {
  slug: string;
  label: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  needs: string[];
  content: string;
}

export interface SolutionCategory {
  slug: string;
  label: string;
  image: string;
  items: SolutionItem[];
}

export const solutionCategories: SolutionCategory[] = [
  {
    slug: "evenementiel",
    label: "Événementiel",
    image: "https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg",
    items: [
      {
        slug: "organisation-evenements-btob",
        label: "Organisation des événements BtoB",
        description: "Organisation complète d'événements professionnels pour entreprises",
        heroTitle: "Organisation des événements BtoB",
        heroSubtitle: "Des événements mémorables pour votre entreprise",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg",
        needs: [
          "Organiser des conférences et séminaires",
          "Lancer un nouveau produit",
          "Créer des événements de team building",
          "Organiser des salons professionnels",
          "Gérer la logistique événementielle"
        ],
        content: "Nous concevons et organisons des événements BtoB sur mesure qui marquent les esprits. De la conception à l'exécution, notre équipe prend en charge tous les aspects de votre événement."
      },
      {
        slug: "impression-grand-format",
        label: "Impression grand format",
        description: "Solutions d'impression grand format pour tous vos besoins visuels",
        heroTitle: "Impression Grand Format",
        heroSubtitle: "Impact visuel maximum pour votre communication",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg",
        needs: [
          "Bâches publicitaires",
          "Kakémonos et roll-ups",
          "Affiches grand format",
          "Adhésifs et vinyles",
          "Panneaux d'exposition"
        ],
        content: "Notre atelier d'impression grand format vous offre des solutions visuelles percutantes. Qualité HD, couleurs éclatantes et finitions professionnelles pour tous vos supports."
      },
      {
        slug: "stands-exposition",
        label: "Stands d'exposition",
        description: "Conception et réalisation de stands d'exposition sur mesure",
        heroTitle: "Stands d'Exposition",
        heroSubtitle: "Démarquez-vous dans les salons et foires",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg",
        needs: [
          "Stands modulaires",
          "Stands sur mesure",
          "Aménagement d'espaces",
          "Mobilier d'exposition",
          "Éclairage et signalétique"
        ],
        content: "Nous concevons des stands d'exposition uniques qui captent l'attention et reflètent votre identité de marque. De la conception 3D à l'installation, nous gérons tout."
      },
      {
        slug: "plv-ilv-banners",
        label: "PLV / ILV et banners",
        description: "Publicité sur lieu de vente et signalétique intérieure",
        heroTitle: "PLV / ILV et Banners",
        heroSubtitle: "Boostez vos ventes avec une PLV percutante",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg",
        needs: [
          "Présentoirs de comptoir",
          "Totems et colonnes",
          "Displays et kakémonos",
          "Stop-rayons et wobblers",
          "Banners et drapeaux"
        ],
        content: "Maximisez l'impact de vos produits en point de vente avec nos solutions PLV/ILV. Conception créative et fabrication de qualité pour une visibilité optimale."
      },
      {
        slug: "enseignes-lettrage",
        label: "Enseignes et lettrage",
        description: "Enseignes lumineuses et lettrage pour votre identité visuelle",
        heroTitle: "Enseignes et Lettrage",
        heroSubtitle: "Votre identité visible jour et nuit",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg",
        needs: [
          "Enseignes lumineuses LED",
          "Lettres découpées",
          "Caissons lumineux",
          "Enseignes non lumineuses",
          "Lettrage véhicules"
        ],
        content: "Créez une identité visuelle forte avec nos enseignes et lettrages personnalisés. Solutions durables et esthétiques pour renforcer votre présence."
      },
      {
        slug: "ecrans-bornes-interactives",
        label: "Écrans & Bornes interactives",
        description: "Solutions digitales interactives pour l'événementiel",
        heroTitle: "Écrans & Bornes Interactives",
        heroSubtitle: "L'innovation au service de votre communication",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg",
        needs: [
          "Bornes tactiles",
          "Écrans d'affichage dynamique",
          "Murs d'images LED",
          "Solutions interactives",
          "Location d'équipements"
        ],
        content: "Intégrez la technologie dans vos événements avec nos solutions d'écrans et bornes interactives. Engagement client garanti."
      },
      {
        slug: "objets-cadeaux-publicitaires",
        label: "Objets et cadeaux publicitaires",
        description: "Goodies et objets promotionnels personnalisés",
        heroTitle: "Objets et Cadeaux Publicitaires",
        heroSubtitle: "Des cadeaux qui marquent les esprits",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg",
        needs: [
          "Textiles personnalisés",
          "Accessoires de bureau",
          "Goodies high-tech",
          "Cadeaux d'affaires",
          "Packaging personnalisé"
        ],
        content: "Renforcez votre image de marque avec des objets publicitaires de qualité. Large gamme de produits personnalisables pour tous les budgets."
      }
    ]
  },
  {
    slug: "industrie-publicitaire",
    label: "Industrie publicitaire",
    image: "https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg",
    items: [
      {
        slug: "realisation-stands",
        label: "Réalisation de Stands",
        description: "Fabrication de stands sur mesure dans notre atelier",
        heroTitle: "Réalisation de Stands",
        heroSubtitle: "Un atelier dédié à vos projets",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg",
        needs: [
          "Stands personnalisés",
          "Structures métalliques",
          "Habillage et finitions",
          "Montage et démontage",
          "Stockage et logistique"
        ],
        content: "Notre atelier de fabrication réalise vos stands sur mesure avec des matériaux de qualité. Du design à l'installation, nous assurons un service complet."
      },
      {
        slug: "fabrication-plv",
        label: "Fabrication de PLV",
        description: "Production de supports PLV dans notre atelier intégré",
        heroTitle: "Fabrication de PLV",
        heroSubtitle: "Production interne pour plus de réactivité",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg",
        needs: [
          "Présentoirs sur mesure",
          "Displays permanents",
          "PLV carton et PVC",
          "Structures métalliques",
          "Prototypage rapide"
        ],
        content: "Fabrication de PLV de qualité dans notre atelier. Contrôle total du processus pour des délais optimisés et une qualité irréprochable."
      },
      {
        slug: "impression-grand-format-industrie",
        label: "Impression grand format",
        description: "Impression professionnelle grand format",
        heroTitle: "Impression Grand Format",
        heroSubtitle: "Qualité professionnelle pour vos projets",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg",
        needs: [
          "Bâches et banderoles",
          "Adhésifs et vinyles",
          "Impression sur supports rigides",
          "Textile imprimé",
          "Papier peint personnalisé"
        ],
        content: "Parc machines dernière génération pour une impression grand format de qualité supérieure. Tous supports, toutes dimensions."
      },
      {
        slug: "impression-petit-format",
        label: "Impression petit format",
        description: "Impression offset et numérique petit format",
        heroTitle: "Impression Petit Format",
        heroSubtitle: "Précision et qualité pour vos documents",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg",
        needs: [
          "Cartes de visite",
          "Flyers et dépliants",
          "Brochures et catalogues",
          "Papeterie d'entreprise",
          "Impression numérique"
        ],
        content: "Impression petit format de qualité pour tous vos supports de communication. Offset et numérique selon vos besoins."
      },
      {
        slug: "impression-directe-uv",
        label: "Impression directe et UV",
        description: "Technologie d'impression UV sur tous supports",
        heroTitle: "Impression Directe et UV",
        heroSubtitle: "Innovation et polyvalence",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg",
        needs: [
          "Impression sur bois",
          "Impression sur verre",
          "Impression sur métal",
          "Impression sur plastique",
          "Objets personnalisés"
        ],
        content: "Notre technologie d'impression UV permet d'imprimer directement sur presque tous les supports. Résultats durables et éclatants."
      },
      {
        slug: "enseignes-lettrage-industrie",
        label: "Enseignes et lettrage",
        description: "Fabrication d'enseignes et lettrage professionnel",
        heroTitle: "Enseignes et Lettrage",
        heroSubtitle: "Savoir-faire artisanal et industriel",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg",
        needs: [
          "Lettres en relief",
          "Enseignes LED",
          "Caissons lumineux",
          "Totems et pylônes",
          "Signalétique intérieure"
        ],
        content: "Fabrication d'enseignes et lettrage dans notre atelier. Du design à la pose, nous maîtrisons toute la chaîne de production."
      },
      {
        slug: "decoupe-laser-cnc",
        label: "Découpe Laser et CNC",
        description: "Découpe de précision laser et CNC",
        heroTitle: "Découpe Laser et CNC",
        heroSubtitle: "Précision et polyvalence",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg",
        needs: [
          "Découpe bois et MDF",
          "Découpe acrylique et PVC",
          "Découpe métal",
          "Formes complexes",
          "Prototypage"
        ],
        content: "Machines de découpe laser et CNC de dernière génération pour une précision parfaite sur tous types de matériaux."
      },
      {
        slug: "marquage-gravure",
        label: "Marquage et Gravure",
        description: "Services de marquage et gravure personnalisés",
        heroTitle: "Marquage et Gravure",
        heroSubtitle: "Personnalisation durable",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg",
        needs: [
          "Gravure laser",
          "Marquage à chaud",
          "Sérigraphie",
          "Tampographie",
          "Broderie"
        ],
        content: "Solutions de marquage et gravure pour personnaliser vos produits de manière permanente. Qualité et durabilité garanties."
      }
    ]
  },
  {
    slug: "communication-globale",
    label: "Communication globale",
    image: "https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg",
    items: [
      {
        slug: "strategie-communication",
        label: "Stratégie de communication",
        description: "Conseil et stratégie de communication globale",
        heroTitle: "Stratégie de Communication",
        heroSubtitle: "Une vision claire pour votre marque",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg",
        needs: [
          "Audit de communication",
          "Positionnement de marque",
          "Plan de communication",
          "Stratégie média",
          "Conseil en image"
        ],
        content: "Nous élaborons des stratégies de communication sur mesure alignées avec vos objectifs business. Analyse, conseil et accompagnement."
      },
      {
        slug: "modelisation-campagne",
        label: "Modélisation de campagne",
        description: "Conception et modélisation de campagnes publicitaires",
        heroTitle: "Modélisation de Campagne",
        heroSubtitle: "Des campagnes qui performent",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg",
        needs: [
          "Conception de campagnes",
          "Médiaplanification",
          "Campagnes multi-canal",
          "Mesure de performance",
          "Optimisation ROI"
        ],
        content: "Conception de campagnes publicitaires impactantes. De l'idée créative à la diffusion, nous optimisons chaque étape pour maximiser vos résultats."
      },
      {
        slug: "redaction-contenus",
        label: "Rédaction de contenus",
        description: "Création de contenus rédactionnels professionnels",
        heroTitle: "Rédaction de Contenus",
        heroSubtitle: "Des mots qui portent votre message",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg",
        needs: [
          "Contenus web et SEO",
          "Rédaction publicitaire",
          "Storytelling de marque",
          "Communiqués de presse",
          "Contenus réseaux sociaux"
        ],
        content: "Notre équipe de rédacteurs crée des contenus engageants qui parlent à votre audience. Ton, style et message adaptés à votre marque."
      },
      {
        slug: "conception-graphique",
        label: "Conception graphique",
        description: "Design graphique et identité visuelle",
        heroTitle: "Conception Graphique",
        heroSubtitle: "Créativité au service de votre image",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg",
        needs: [
          "Identité visuelle",
          "Charte graphique",
          "Supports print",
          "Illustrations",
          "Packaging design"
        ],
        content: "Design graphique créatif et professionnel. Nous donnons vie à vos idées avec des visuels percutants et cohérents."
      },
      {
        slug: "organisation-evenements-com",
        label: "Organisation des événements BtoB",
        description: "Organisation d'événements dans le cadre de votre stratégie",
        heroTitle: "Organisation des Événements BtoB",
        heroSubtitle: "L'événementiel au cœur de votre communication",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg",
        needs: [
          "Lancements de produits",
          "Conventions d'entreprise",
          "Séminaires et formations",
          "Événements clients",
          "Relations presse"
        ],
        content: "L'événementiel comme levier de communication. Nous intégrons vos événements dans une stratégie globale cohérente."
      },
      {
        slug: "impression-petit-format-com",
        label: "Impression petit format",
        description: "Supports imprimés pour votre communication",
        heroTitle: "Impression Petit Format",
        heroSubtitle: "Qualité print pour votre image",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg",
        needs: [
          "Cartes de visite premium",
          "Plaquettes commerciales",
          "Rapports annuels",
          "Invitations",
          "Papeterie de luxe"
        ],
        content: "Impression petit format haut de gamme pour des supports qui reflètent la qualité de votre marque."
      },
      {
        slug: "branding",
        label: "Branding",
        description: "Création et développement de marque",
        heroTitle: "Branding",
        heroSubtitle: "Construisez une marque forte",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg",
        needs: [
          "Création de marque",
          "Repositionnement",
          "Naming",
          "Brand book",
          "Déclinaison de marque"
        ],
        content: "Nous construisons des marques fortes et mémorables. De la création du nom à la charte complète, votre identité prend forme."
      },
      {
        slug: "digital",
        label: "Digital",
        description: "Solutions de communication digitale",
        heroTitle: "Digital",
        heroSubtitle: "Votre présence numérique optimisée",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/digital-1.jpg",
        needs: [
          "Stratégie digitale",
          "Réseaux sociaux",
          "E-mailing",
          "Publicité en ligne",
          "Analytics et reporting"
        ],
        content: "Solutions digitales complètes pour développer votre présence en ligne. Stratégie, création et gestion de vos canaux digitaux."
      },
      {
        slug: "developpement-sites-web",
        label: "Développement des sites web",
        description: "Conception et développement de sites internet",
        heroTitle: "Développement de Sites Web",
        heroSubtitle: "Des sites performants et esthétiques",
        heroImage: "https://epitaphe.ma/wp-content/uploads/2020/04/digital-1.jpg",
        needs: [
          "Sites vitrines",
          "Sites e-commerce",
          "Applications web",
          "Refonte de site",
          "Maintenance et évolution"
        ],
        content: "Développement de sites web sur mesure, responsive et optimisés SEO. Design moderne et expérience utilisateur au cœur de nos créations."
      }
    ]
  }
];

export const metiersData = [
  {
    slug: "communication-corporate",
    label: "Communication corporate",
    description: "Gagnez en positionnement !",
    heroTitle: "Gagnez en positionnement !",
    heroSubtitle: "Une communication corporate pertinente requiert une stratégie bien réfléchie et des actions structurées et percutantes.",
    heroImage: "https://epitaphe.ma/wp-content/uploads/2020/05/bg-com-corporate.jpg",
    needs: [
      "Une maîtrise 360° des métiers du Marketing et de la Communication",
      "Une écoute active de vos besoins",
      "Des moyens pour optimiser vos budgets",
      "Des actions pour maximiser votre visibilité",
      "Des outils pour mesurer votre ROI"
    ],
    content: "Confiez cette mission à une agence avec une expertise et une vision 360° qui vous permet de maîtriser votre communication corporate, en vous proposant des solutions globales, intégrées et modernes. De la rédaction de messages au design graphique et print petit et grand formats, de l’événementiel à la communication digitale, en passant par la communication interne ou financière… Epitaphe 360 vous accompagne dans l’élaboration et l’exécution d’actions pertinentes et homogènes qui répondent aux attentes de chacun de vos publics cibles."
  },
  {
    slug: "communication-produits",
    label: "Communication produits",
    description: "Gagnez des clients et... du temps en plus !",
    heroTitle: "Gagnez des clients et... du temps en plus !",
    heroSubtitle: "Une bonne communication produits (ou services) peut vous aider à mettre en avant votre proposition de valeur et à vous distinguer de vos concurrents.",
    heroImage: "https://epitaphe.ma/wp-content/uploads/2020/05/bg-com-produits.jpg",
    needs: [
      "Un accompagnement tout au long de la vie de votre produit",
      "Des actions complémentaires et homogènes pour plus d’impact",
      "Un seul interlocuteur pour plusieurs prestations"
    ],
    content: "Grâce à nos compétences 360°, nous vous proposons un interlocuteur unique pour trouver le bon mot et le bon format qui capteraient votre marché, et nous vous accompagnons dans l’élaboration et l’exécution d’actions ciblées (digital, événements, PLV…) pour positionner ou promouvoir vos produits et services et activer des leviers de vente adaptés à vos clients."
  },
  {
    slug: "communication-evenementielle",
    label: "Communication événementielle",
    description: "Marquez les esprits!",
    heroTitle: "Marquez les esprits!",
    heroSubtitle: "La communication événementielle demeure parmi les techniques de communication à fort impact. Particulièrement si votre événement est intéressant, ciblé, maîtrisé et convenablement organisé.",
    heroImage: "https://epitaphe.ma/wp-content/uploads/2020/05/bg-com-event.jpg",
    needs: [
      "Des idées originales et des concepts d’événements attractifs",
      "Un seul interlocuteur pour la gestion de l’amont à l’aval",
      "Conception des supports de communication (Back drop, photocall, Fonds de scènes)",
      "Digitalisation des événements à la demande"
    ],
    content: "Conceptualisation, rédaction de contenu, création graphique, print, digitalisation, promotion, logistique et mise en place, coordination, suivi et évaluation, goodies… Notre agence de communication Epitaphe360 vous apporte une réelle valeur ajoutée en gérant votre événement de A à Z."
  },
  {
    slug: "communication-financiere",
    label: "Communication financière",
    description: "Gagnez de la notoriété !",
    heroTitle: "Gagnez de la notoriété !",
    heroSubtitle: "Annonce de résultats, rapports d’activité, Introduction en bourse…, la communication financière est importante pour mettre en avant vos résultats financiers.",
    heroImage: "https://epitaphe.ma/wp-content/uploads/2020/05/photobas-comfi.jpg",
    needs: [
      "Un accompagnement de proximité pour définir vos messages",
      "Des experts pour vous aider à écrire vos discours et vous coacher",
      "Un seul interlocuteur pour toutes vos actions : rédaction, mise en page, impression, diffusion"
    ],
    content: "Notre agence de communication, Epitaphe 360 vous accompagne dans toutes les étapes de votre communication financière : de la rédaction de contenus (rapports d’activité annuels, notes d’information…) à sa diffusion (interne et externe), en passant par le design graphique, le print, la digitalisation de vos supports de communication ou l’organisation d’événement."
  },
  {
    slug: "communication-interne",
    label: "Communication interne",
    description: "Gagnez en cohésion d'équipe !",
    heroTitle: "Gagnez en cohésion d'équipe !",
    heroSubtitle: "La communication interne peut être un véritable atout pour l’information et la motivation de vos salariés.",
    heroImage: "https://epitaphe.ma/wp-content/uploads/2020/05/bg-com-interne.jpg",
    needs: [
      "Accompagnement dans toutes les étapes de réalisation de vos supports internes",
      "Une équipe expérimentée à l’écoute de vos besoins",
      "Un budget optimisé avec des prestations réalisées en interne",
      "Des outils modernes pour digitaliser votre communication interne"
    ],
    content: "Epitaphe 360 vous accompagne pas à pas aussi bien dans l’élaboration et l’impression de vos journaux et supports, que dans l’organisation de vos événements et la digitalisation de votre communication interne. Grâce à notre expertise, développez une culture d’appartenance forte au sein de votre entreprise."
  }
];

export function getSolutionBySlug(slug: string): SolutionItem | undefined {
  // Check in metiersData first
  const metier = metiersData.find(item => item.slug === slug);
  if (metier) return metier as SolutionItem;

  for (const category of solutionCategories) {
    const solution = category.items.find(item => item.slug === slug);
    if (solution) return solution;
  }
  return undefined;
}

export function getCategoryBySlug(slug: string): SolutionCategory | undefined {
  return solutionCategories.find(cat => cat.slug === slug);
}

export function getAllSolutionSlugs(): string[] {
  const metiersSlugs = metiersData.map(item => item.slug);
  const solutionSlugs = solutionCategories.flatMap(cat => cat.items.map(item => item.slug));
  return [...metiersSlugs, ...solutionSlugs];
}
