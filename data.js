// Source unique des données du portfolio — bilingue (fr/en).
// Les champs traduisibles sont des objets {fr, en}.
window.portfolio = {
  name: 'Portfolio',
  github: 'https://github.com/Shok75',
  // Endpoint HTTPS du formulaire de contact (ex: service de formulaire).
  // Laisser vide = le formulaire s'affiche mais l'envoi est désactivé.
  contactEndpoint: '',
  availability: {
    fr: 'Recherche de stage · 4 mois ou plus à partir de mars',
    en: 'Seeking an internship · 4+ months from March'
  },
  // Clés de catégorie = tokens ; les libellés sont traduits dans i18n.js
  skills: {
    languages: ['Java', 'PHP', 'Python', 'JavaScript', 'HTML', 'CSS', 'C', 'Bash / Unix'],
    technologies: ['JavaFX', 'MySQL', 'PostgreSQL', 'MongoDB', 'Git', 'Maven'],
    tools: ['IntelliJ', 'PyCharm', 'PHPStorm', 'Linux']
  },
  education: {
    period: '2024 — 2027',
    title: { fr: 'BUT Informatique', en: 'BSc in Computer Science (BUT)' },
    description: {
      fr: 'Parcours Réalisation d’applications. Développement web et logiciel, bases de données et algorithmique.',
      en: 'Application Development track. Web & software development, databases and algorithms.'
    },
    tags: {
      fr: ['Développement', 'Bases de données', 'Travail en équipe'],
      en: ['Development', 'Databases', 'Teamwork']
    }
  },
  projects: [
    {
      id: 'demon-realm',
      name: 'Demon Realm',
      context: 'academique',
      state: 'in-progress',
      year: '2025',
      github: 'https://github.com/Shok75/DemonRealm',
      tech: ['Java', 'JavaFX', 'Git', 'Maven'],
      description: {
        fr: 'Jeu d’aventure 2D développé en Java avec JavaFX. Système de combat, inventaire, craft et monde explorable.',
        en: '2D adventure game built in Java with JavaFX. Combat system, inventory, crafting and an explorable world.'
      },
      features: [
        [{ fr: 'Monde explorable', en: 'Explorable world' }, { fr: 'Un monde 2D généré avec différents biomes et environnements à découvrir.', en: 'A 2D world with varied biomes and environments to discover.' }],
        [{ fr: 'Système de combat', en: 'Combat system' }, { fr: 'Combats dynamiques avec différentes armes et attaques spéciales.', en: 'Dynamic combat with different weapons and special attacks.' }],
        [{ fr: 'Inventaire & craft', en: 'Inventory & crafting' }, { fr: 'Gestion d’inventaire et système de crafting pour créer des objets.', en: 'Inventory management and a crafting system to create items.' }]
      ],
      challenges: [
        [{ fr: 'Gestion des collisions', en: 'Collision handling' }, { fr: 'Détection des collisions pour les interactions joueur-environnement et joueur-ennemis.', en: 'Collision detection for player-environment and player-enemy interactions.' }],
        [{ fr: 'Architecture MVC', en: 'MVC architecture' }, { fr: 'Séparation de la logique métier, de l’affichage et des contrôles.', en: 'Separation of business logic, rendering and controls.' }],
        [{ fr: 'Optimisation des performances', en: 'Performance optimization' }, { fr: 'Gestion du rendu graphique et de la boucle de jeu.', en: 'Graphics rendering and game-loop management.' }]
      ],
      images: [
        ['menuDemonRealm', { fr: 'Menu principal', en: 'Main menu' }],
        ['gameplay', { fr: 'Exploration du monde', en: 'World exploration' }],
        ['combat', { fr: 'Système de combat', en: 'Combat system' }],
        ['craft', { fr: 'Inventaire et crafting', en: 'Inventory and crafting' }]
      ]
    },
    {
      id: 'assomanager',
      name: 'AssoManager',
      context: 'academique',
      state: 'done',
      year: '2026',
      github: 'https://github.com/Shok75/AssoManager',
      tech: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS', 'MVC'],
      description: {
        fr: 'Plateforme web de gestion multi-associations développée en PHP avec architecture MVC. Une solution de gestion de buvettes associatives.',
        en: 'Web platform for multi-association management, built in PHP with an MVC architecture. A solution to run association bars/canteens.'
      },
      features: [
        [{ fr: 'Multi-associations', en: 'Multi-association' }, { fr: 'Gestion de plusieurs associations avec isolation complète des données.', en: 'Manage several associations with full data isolation.' }],
        [{ fr: 'Gestion en temps réel', en: 'Real-time management' }, { fr: 'Suivi des commandes et du stock en temps réel avec notifications.', en: 'Real-time order and stock tracking with notifications.' }],
        [{ fr: 'Système de paiement', en: 'Payment system' }, { fr: 'Gestion des soldes, transactions et historique complet.', en: 'Balance management, transactions and full history.' }],
        [{ fr: 'Statistiques', en: 'Statistics' }, { fr: 'Tableaux de bord et graphiques pour le suivi des ventes.', en: 'Dashboards and charts to track sales.' }]
      ],
      challenges: [
        [{ fr: 'Isolation multi-associations', en: 'Multi-tenant isolation' }, { fr: 'Séparation stricte des données des associations sur une infrastructure commune.', en: 'Strict data separation between associations on shared infrastructure.' }],
        [{ fr: 'Architecture MVC', en: 'MVC architecture' }, { fr: 'Architecture modulaire permettant l’ajout de nouvelles fonctionnalités.', en: 'Modular architecture allowing new features to be added easily.' }],
        [{ fr: 'Sécurité des transactions', en: 'Transaction security' }, { fr: 'Contrôles rigoureux pour la gestion des soldes et des paiements.', en: 'Rigorous controls for balance and payment handling.' }]
      ],
      roles: [
        [{ fr: 'Administrateur', en: 'Administrator' }, { fr: 'Gestion des associations, configuration globale, validation des demandes et statistiques globales.', en: 'Association management, global configuration, request approval and global statistics.' }],
        [{ fr: 'Gestionnaire', en: 'Manager' }, { fr: 'Gestion du stock, création de produits, fournisseurs et statistiques de l’association.', en: 'Stock management, product creation, suppliers and association statistics.' }],
        [{ fr: 'Barman', en: 'Bartender' }, { fr: 'Prise de commandes, transactions, consultation du stock et historique des ventes.', en: 'Taking orders, transactions, stock lookup and sales history.' }],
        [{ fr: 'Client', en: 'Customer' }, { fr: 'Rechargement du solde, consultation du compte, historique des achats et profil personnel.', en: 'Top up balance, view account, purchase history and personal profile.' }]
      ],
      images: [
        ['accueil', { fr: 'Accueil clients', en: 'Customer home' }],
        ['historique', { fr: 'Historique', en: 'History' }],
        ['vente', { fr: 'Interface de commandes', en: 'Ordering interface' }],
        ['stats', { fr: 'Graphiques et statistiques', en: 'Charts and statistics' }]
      ]
    },
    {
      id: 'plateforme-tournois',
      name: { fr: 'Plateforme de tournois', en: 'Tournament platform' },
      context: 'academique',
      state: 'upcoming',
      year: '',
      github: '',
      tech: [{ fr: 'À compléter', en: 'To be added' }],
      description: {
        fr: 'Plateforme de gestion et de suivi de tournois. (Détails à compléter : technologies, fonctionnalités, statut.)',
        en: 'A platform to manage and track tournaments. (Details to be added: technologies, features, status.)'
      },
      features: [],
      challenges: [],
      images: []
    }
  ]
};
