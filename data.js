// Source unique des données du portfolio — bilingue (fr/en).
// Les champs traduisibles sont des objets {fr, en}.
window.portfolio = {
  name: 'Portfolio',
  github: 'https://github.com/Shok75',
  // Endpoint HTTPS du formulaire de contact (ex: service de formulaire).
  // Laisser vide = le formulaire s'affiche mais l'envoi est désactivé.
  contactEndpoint: 'https://formspree.io/f/mvkgzpyk',
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
      fr: 'Parcours Réalisation d’applications : conception, développement et validation. Développement web et logiciel, bases de données et travail en équipe (SAÉ).',
      en: 'Application Development track: design, development and validation. Web & software development, databases and project-based teamwork (SAÉ).'
    },
    tags: {
      fr: ['Conception & développement', 'Tests & validation', 'Gestion de projet'],
      en: ['Design & development', 'Testing & validation', 'Project management']
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
      id: 'heist',
      name: 'HEIST',
      context: 'academique',
      state: 'in-progress',
      year: '2026',
      github: '',
      tech: ['TypeScript', 'React', 'NestJS', 'PostgreSQL', 'Prisma', 'Socket.IO', 'Git'],
      description: {
        fr: 'Plateforme de tournois esport en équipes pour une association étudiante, réalisée en binôme. API REST NestJS temps réel et interface React mobile first.',
        en: 'Team-based esports tournament platform for a student association, built as a pair. Real-time NestJS REST API and a mobile-first React interface.'
      },
      features: [
        [{ fr: 'Brackets automatiques', en: 'Automatic brackets' }, { fr: 'Génération du tableau à élimination directe et saisie des résultats match par match.', en: 'Single-elimination bracket generation and match-by-match result entry.' }],
        [{ fr: 'Temps réel', en: 'Real time' }, { fr: 'Scores, brackets et chat d’équipe mis à jour sans recharger la page (Socket.IO).', en: 'Scores, brackets and team chat update without reloading the page (Socket.IO).' }],
        [{ fr: 'Équipes & capitaines', en: 'Teams & captains' }, { fr: 'Création d’équipe, demandes d’adhésion, gestion des membres et chat privé.', en: 'Team creation, join requests, member management and private chat.' }],
        [{ fr: 'Panel d’administration', en: 'Admin panel' }, { fr: 'Cycle de vie des tournois, catalogue de jeux (IGDB) et modération.', en: 'Tournament lifecycle, game catalogue (IGDB) and moderation.' }]
      ],
      challenges: [
        [{ fr: 'Droits d’accès', en: 'Access control' }, { fr: 'Rôles visiteur / joueur / capitaine / admin, chaque règle couverte par un test de refus (e2e).', en: 'Visitor / player / captain / admin roles, each rule covered by a refusal test (e2e).' }],
        [{ fr: 'Front indépendant du back', en: 'Backend-independent frontend' }, { fr: 'Couche d’accès unique avec une implémentation simulée (mocks) et une implémentation HTTP.', en: 'Single data-access layer with a mocked implementation and an HTTP one.' }],
        [{ fr: 'Qualité & CI', en: 'Quality & CI' }, { fr: 'Tests Jest et Vitest, intégration continue GitHub Actions, fiches de décision et audit de sécurité.', en: 'Jest and Vitest tests, GitHub Actions CI, decision records and a security audit.' }]
      ],
      roles: [
        [{ fr: 'Administrateur', en: 'Administrator' }, { fr: 'Crée et pilote les tournois, saisit les résultats, gère le catalogue de jeux.', en: 'Creates and runs tournaments, enters results, manages the game catalogue.' }],
        [{ fr: 'Capitaine', en: 'Captain' }, { fr: 'Constitue son équipe, accepte les demandes et l’inscrit aux tournois.', en: 'Builds the team, accepts requests and registers it for tournaments.' }],
        [{ fr: 'Joueur', en: 'Player' }, { fr: 'Rejoint une équipe, échange dans le chat et suit ses matchs.', en: 'Joins a team, chats with teammates and follows their matches.' }],
        [{ fr: 'Visiteur', en: 'Visitor' }, { fr: 'Consulte les tournois, les brackets et le classement en direct.', en: 'Browses tournaments, brackets and live rankings.' }]
      ],
      images: [
        ['heist-accueil', { fr: 'Accueil', en: 'Home' }],
        ['heist-bracket', { fr: 'Bracket en direct', en: 'Live bracket' }],
        ['heist-admin', { fr: 'Panel d’administration', en: 'Admin panel' }],
        ['heist-espace', { fr: 'Espace joueur', en: 'Player dashboard' }]
      ]
    },
    {
      id: 'app-bourse',
      name: { fr: 'Suivi Bourse', en: 'Stock Tracker' },
      context: 'personnel',
      state: 'in-progress',
      year: '2026',
      github: '',
      tech: ['TypeScript', 'Next.js', 'React', 'SQLite', 'Tailwind CSS', 'Java'],
      description: {
        fr: 'Application de suivi de portefeuille boursier personnel (sans achat/vente ni conseil) : comptes multiples, mouvements, cours de marché et graphiques. Fonctionne hors ligne.',
        en: 'Personal stock portfolio tracker (no trading, no advice): multiple accounts, transactions, market quotes and charts. Works offline.'
      },
      features: [
        [{ fr: 'Tableau de bord', en: 'Dashboard' }, { fr: 'Patrimoine, apports, plus-values et répartition par secteur, pays ou compte, filtrables par période.', en: 'Net worth, contributions, gains and allocation by sector, country or account, filterable by period.' }],
        [{ fr: 'Cours de marché', en: 'Market quotes' }, { fr: 'Synchronisation Yahoo Finance avec repli automatique et derniers cours mémorisés hors ligne.', en: 'Yahoo Finance sync with automatic fallback and last quotes kept offline.' }],
        [{ fr: 'Mouvements journalisés', en: 'Logged transactions' }, { fr: 'Achats, ventes, versements, dividendes ; modification et suppression douce tracées.', en: 'Buys, sells, deposits, dividends; edits and soft deletes are audited.' }],
        [{ fr: 'Statistiques & graphiques', en: 'Statistics & charts' }, { fr: 'Évolution des titres, dividendes mensuels et analyse pédagogique des données.', en: 'Holdings history, monthly dividends and an educational data analysis.' }]
      ],
      challenges: [
        [{ fr: 'Persistance locale fiable', en: 'Reliable local storage' }, { fr: 'Base SQLite intégrée, journal d’audit et sauvegarde quotidienne automatique.', en: 'Embedded SQLite database, audit log and automatic daily backup.' }],
        [{ fr: 'Mode hors ligne', en: 'Offline mode' }, { fr: 'Cours mémorisés et indication de la dernière synchronisation quand le marché est injoignable.', en: 'Stored quotes and last-sync notice when the market is unreachable.' }],
        [{ fr: 'Lancement en un clic', en: 'One-click launch' }, { fr: 'Lanceur Windows/macOS/Linux qui compile et démarre l’application, plus un compagnon Android.', en: 'Windows/macOS/Linux launcher that builds and starts the app, plus an Android companion.' }]
      ],
      images: [
        ['bourse-dashboard', { fr: 'Tableau de bord', en: 'Dashboard' }],
        ['bourse-actifs', { fr: 'Actifs suivis', en: 'Tracked assets' }],
        ['bourse-actif', { fr: 'Fiche d’un actif', en: 'Asset detail' }],
        ['bourse-mouvements', { fr: 'Mouvements', en: 'Transactions' }]
      ]
    }
  ]
};
