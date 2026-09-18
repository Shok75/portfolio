// Compétences, expérience et liens — édite ici, l'interface se met à jour.

window.PORTFOLIO_SKILLS = {
  Langages: [
    { name: "Java", icon: "java/java-original" },
    { name: "PHP", icon: "php/php-original" },
    { name: "Python", icon: "python/python-original" },
    { name: "JavaScript", icon: "javascript/javascript-original" },
    { name: "HTML", icon: "html5/html5-original" },
    { name: "CSS", icon: "css3/css3-original" },
    { name: "C", icon: "c/c-original" },
    { name: "Unix", icon: "bash/bash-original" }
  ],
  Technologies: [
    { name: "MySQL", icon: "mysql/mysql-original" },
    { name: "PostgreSQL", icon: "postgresql/postgresql-original" },
    { name: "MongoDB", icon: "mongodb/mongodb-original" },
    { name: "Git", icon: "git/git-original" }
  ],
  Outils: [
    { name: "IntelliJ", icon: "intellij/intellij-original" },
    { name: "PyCharm", icon: "pycharm/pycharm-original" },
    { name: "PHPStorm", icon: "phpstorm/phpstorm-original" },
    { name: "Linux", icon: "linux/linux-original" }
  ]
};

// Timeline "PARCOURS" — type: FORMATION | PROJET | STAGE | EXPÉRIENCE
window.PORTFOLIO_EXPERIENCE = [
  {
    year: "2024 — 2026",
    type: "FORMATION",
    title: "BUT Informatique",
    description:
      "Parcours Réalisation d'applications. Développement web et logiciel, bases de données, algorithmique.",
    tags: ["Java", "PHP", "SQL", "Web"]
  },
  {
    year: "2025 — 2026",
    type: "PROJET",
    title: "AssoManager",
    description:
      "Application web de gestion multi-associations en PHP/MySQL, architecture MVC.",
    tags: ["PHP", "MySQL", "MVC"]
  },
  {
    year: "2025",
    type: "PROJET",
    title: "Demon Realm",
    description:
      "Jeu d'aventure 2D en Java/JavaFX : combat, inventaire, craft, monde explorable.",
    tags: ["Java", "JavaFX"]
  }
];

// Liens de contact — remplace LinkedIn et le CV quand tu les as.
window.PORTFOLIO_CONTACT = {
  email: "removed@example.invalid",
  github: "https://github.com/Shok75",
  linkedin: "", // ex: "https://www.linkedin.com/in/ton-profil"
  cv: "" // ex: "cv.pdf"
};
