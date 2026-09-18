// Source unique des données du portfolio — édite ici, l'interface se met à jour.
// Renseigne linkedin et cv quand tu les as (laissés vides = non affichés).
window.portfolio = {
  name: 'Portfolio développeur',
  email: 'removed@example.invalid',
  github: 'https://github.com/Shok75',
  linkedin: '', // ex: https://www.linkedin.com/in/ton-profil
  cv: '',       // ex: assets/cv.pdf
  availability: 'Recherche de stage · 4 mois ou plus à partir de mars',
  skills: {
    Langages: ['Java', 'PHP', 'Python', 'JavaScript', 'HTML', 'CSS', 'C', 'Bash / Unix'],
    Technologies: ['JavaFX', 'MySQL', 'PostgreSQL', 'MongoDB', 'Git', 'Maven'],
    Outils: ['IntelliJ', 'PyCharm', 'PHPStorm', 'Linux']
  },
  projects: [
    {
      id: 'demon-realm',
      name: 'Demon Realm',
      type: 'Jeu · Projet académique',
      context: 'academique',
      year: '2025',
      status: 'En développement',
      github: 'https://github.com/Shok75/DemonRealm',
      tech: ['Java', 'JavaFX', 'Git', 'Maven'],
      description: 'Jeu d’aventure 2D développé en Java avec JavaFX. Système de combat, inventaire et monde explorable.',
      features: [
        ['Monde explorable', 'Un monde 2D généré avec différents biomes et environnements à découvrir.'],
        ['Système de combat', 'Combats dynamiques avec différentes armes et attaques spéciales.'],
        ['Inventaire & craft', 'Gestion d’inventaire et système de crafting pour créer des objets.']
      ],
      challenges: [
        ['Gestion des collisions', 'Détection des collisions pour les interactions joueur-environnement et joueur-ennemis.'],
        ['Architecture MVC', 'Séparation de la logique métier, de l’affichage et des contrôles.'],
        ['Optimisation des performances', 'Gestion du rendu graphique et de la boucle de jeu.']
      ],
      images: [
        ['menuDemonRealm', 'Menu principal'],
        ['gameplay', 'Exploration du monde'],
        ['combat', 'Système de combat'],
        ['craft', 'Inventaire et crafting']
      ]
    },
    {
      id: 'assomanager',
      name: 'AssoManager',
      type: 'Application web',
      context: 'academique',
      year: '2026',
      status: 'Projet terminé',
      github: 'https://github.com/Shok75/AssoManager',
      tech: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS', 'MVC'],
      description: 'Plateforme web de gestion multi-associations développée en PHP avec architecture MVC. Une solution de gestion de buvettes associatives.',
      features: [
        ['Multi-associations', 'Gestion de plusieurs associations avec isolation complète des données.'],
        ['Gestion en temps réel', 'Suivi des commandes et du stock en temps réel avec notifications.'],
        ['Système de paiement', 'Gestion des soldes, transactions et historique complet.'],
        ['Statistiques', 'Tableaux de bord et graphiques pour le suivi des ventes.']
      ],
      challenges: [
        ['Isolation multi-associations', 'Séparation stricte des données des associations sur une infrastructure commune.'],
        ['Architecture MVC', 'Architecture modulaire permettant l’ajout de nouvelles fonctionnalités.'],
        ['Sécurité des transactions', 'Contrôles rigoureux pour la gestion des soldes et des paiements.']
      ],
      roles: [
        ['Administrateur', 'Gestion des associations, configuration globale, validation des demandes et statistiques globales.'],
        ['Gestionnaire', 'Gestion du stock, création de produits, fournisseurs et statistiques de l’association.'],
        ['Barman', 'Prise de commandes, transactions, consultation du stock et historique des ventes.'],
        ['Client', 'Rechargement du solde, consultation du compte, historique des achats et profil personnel.']
      ],
      images: [
        ['accueil', 'Accueil clients'],
        ['historique', 'Historique'],
        ['vente', 'Interface de commandes'],
        ['stats', 'Graphiques et statistiques']
      ]
    },
    {
      id: 'plateforme-tournois',
      name: 'Plateforme de tournois',
      type: 'Application web',
      context: 'academique',
      year: '',
      status: 'À venir',
      pending: true,
      github: '',
      tech: ['À compléter'],
      description: 'Plateforme de gestion et de suivi de tournois. (Détails à compléter : technologies, fonctionnalités, statut.)',
      features: [],
      challenges: [],
      images: []
    }
  ]
};
