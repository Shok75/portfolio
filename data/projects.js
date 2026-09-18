// Données des projets — modifie/ajoute ici sans toucher à l'interface.
// status: "termine" | "en-cours" | "a-venir"  (pilote la pastille de statut)
window.PORTFOLIO_PROJECTS = [
  {
    id: "demon-realm",
    mission: "01",
    title: "Demon Realm",
    category: "Game Development",
    description:
      "Jeu d'aventure 2D développé en Java avec JavaFX. Système de combat, inventaire, craft et monde explorable.",
    tags: ["Java", "JavaFX", "Maven"],
    status: "en-cours",
    statusLabel: "En développement",
    image: "images/menuDemonRealm.webp",
    page: "demon-realm.html",
    github: "https://github.com/Shok75/DemonRealm",
    accent: "#667eea"
  },
  {
    id: "asso-manager",
    mission: "02",
    title: "AssoManager",
    category: "Web Application",
    description:
      "Application web de gestion multi-associations en PHP (architecture MVC) et MySQL. Gestion de stock, commandes, soldes et statistiques.",
    tags: ["PHP", "MySQL", "MVC", "JavaScript"],
    status: "termine",
    statusLabel: "Projet terminé",
    image: "images/accueil.webp",
    page: "asso-manager.html",
    github: "https://github.com/Shok75/AssoManager",
    accent: "#f5576c"
  },
  {
    id: "plateforme-tournois",
    mission: "03",
    title: "Plateforme de tournois",
    category: "Web Application",
    description:
      "Plateforme de gestion et de suivi de tournois. (Détails à compléter : technologies, fonctionnalités, statut.)",
    tags: ["À compléter"],
    status: "a-venir",
    statusLabel: "À venir",
    image: "",
    page: "",
    github: "",
    accent: "#4facfe"
  },
  {
    id: "controle-acces-ferroviaire",
    mission: "04",
    title: "Contrôle d'accès ferroviaire",
    category: "Système",
    description:
      "Système de contrôle d'accès dans un contexte ferroviaire. (Détails à compléter : technologies, fonctionnalités, statut.)",
    tags: ["À compléter"],
    status: "a-venir",
    statusLabel: "À venir",
    image: "",
    page: "",
    github: "",
    accent: "#35e08a"
  }
];
