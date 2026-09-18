/* ==========================================================================
   Portfolio "Developer Mode" — logique bilingue (EN par défaut).
   Toutes les chaînes viennent de i18n.js (UI) et data.js (contenu {fr,en}).
   ========================================================================== */
const data = window.portfolio;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---- Langue ---- */
function initialLang() {
  try { const s = localStorage.getItem('portfolio-lang'); if (s === 'fr' || s === 'en') return s; } catch {}
  return 'en'; // anglais prioritaire
}
let lang = initialLang();
let T = window.I18N[lang];
const tf = v => (v && typeof v === 'object' && !Array.isArray(v)) ? (v[lang] ?? v.en ?? v.fr ?? '') : (v ?? '');

/* ---- Icônes ---- */
const uiIcons = { accueil: "M3 11 12 3l9 8v10h-6v-7H9v7H3z", profil: "M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10M3 22v-3a9 6 0 0 1 18 0v3z", projets: "M2 5h8l2 3h10v13H2zM2 3h8l2 2H2z", competences: "M3 14h4v8H3zM10 8h4v14h-4zM17 2h4v20h-4z", parcours: "M8 2h8v4h6v16H2V6h6zm2 2v2h4V4zM2 11v2h20v-2z", galerie: "M2 3h20v18H2zm3 3v12h14l-5-7-4 5-2-3-3 4zm3 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4", contact: "M2 4h20L12 13zM2 7l10 9L22 7v14H2z" };
const uiIcon = id => '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="' + uiIcons[id] + '"/></svg>';
const featIcons = { explor: 'M12 2 8 12l4-2 4 2z M12 22l4-10-4 2-4-2z', combat: 'M14.5 4 20 4l0 5.5-8.5 8.5-2-2zM4 14l6 6-2 2-6-6z M9.5 4 4 4l0 5.5 8.5 8.5 2-2z', invent: 'M5 8h14v12H5zM9 8V6a3 3 0 0 1 6 0v2', clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 8v4l3 2', wallet: 'M3 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3zM3 7l0-2h13M17 13h.01', chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2', users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M2 21a7 7 0 0 1 14 0M17 11a4 4 0 0 0 0-8M18 21a7 7 0 0 0-3-5.7', shield: 'M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6z', box: 'M4 5h16v15H4zM4 10h16' };
function featureIcon(t) {
  const s = t.toLowerCase();
  const k = /explor|monde|world|environ/.test(s) ? 'explor' : /combat|attaqu|arme|weapon/.test(s) ? 'combat' : /invent|craft|objet|item/.test(s) ? 'invent' : /temps|réel|real-?time/.test(s) ? 'clock' : /paiement|payment|solde|balance|transaction/.test(s) ? 'wallet' : /statist|graph|chart|dashboard|tableau/.test(s) ? 'chart' : /associ|multi|utilisateur|user|rôle|role|tenant/.test(s) ? 'users' : /sécur|secur|isolation/.test(s) ? 'shield' : 'box';
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="' + featIcons[k] + '"/></svg>';
}

/* ---- Sections & état ---- */
const sectionIds = ['accueil', 'profil', 'projets', 'competences', 'parcours', 'contact', 'galerie'];
const markerPos = [[31, 83], [38, 22], [72, 61], [84, 31], [52, 80], [87, 84], [24, 49]];
let current = 'accueil', sound = false, audio, toastTimer;

/* ---- Helpers contenu ---- */
const tags = items => '<div class="tags">' + items.map(x => '<span class="tag">' + esc(tf(x)) + '</span>').join('') + '</div>';
const stateCss = st => ({ 'in-progress': 'en-cours', 'done': 'termine', 'upcoming': '' }[st] || '');
const projectContext = p => p.state === 'upcoming' ? T.context.upcoming : (T.context[p.context] || '');
const skillFiles = { 'Java': 'java', 'JavaFX': 'java', 'PHP': 'php', 'Python': 'python', 'JavaScript': 'javascript', 'HTML': 'html5', 'CSS': 'css3', 'C': 'c', 'Bash / Unix': 'bash', 'MySQL': 'mysql', 'PostgreSQL': 'postgresql', 'MongoDB': 'mongodb', 'Git': 'git', 'Maven': 'maven', 'IntelliJ': 'intellij', 'PyCharm': 'pycharm', 'PHPStorm': 'phpstorm', 'Linux': 'linux' };
const skillLogo = name => '<img class="technology-logo" src="assets/logos/' + skillFiles[name] + '.svg" alt="" width="32" height="32" loading="lazy">';
function techItem(n) { const name = tf(n); const f = skillFiles[name]; return '<li>' + (f ? '<img src="assets/logos/' + f + '.svg" alt="" width="22" height="22" loading="lazy">' : '<span class="pd-tech-ph">' + esc(name[0]) + '</span>') + '<span>' + esc(name) + '</span></li>'; }
function gallery(p) { return '<div class="gallery-grid">' + p.images.map(([file, label]) => '<button class="gallery-shot" data-image="assets/' + file + '.webp" data-caption="' + esc(tf(label)) + '"><img src="assets/' + file + '.webp" alt="' + esc(tf(label)) + '" loading="lazy"><span>' + esc(tf(label)) + '</span></button>').join('') + '</div>'; }
function personalLink(type, label) {
  const url = data[type]; if (!url) return '<div class="contact-option">' + esc(label) + '<small>' + T.common.toBeAdded + '</small></div>';
  const safe = type === 'email' ? 'mailto:' + url : url;
  if (type !== 'email' && type !== 'cv' && !/^https?:\/\//.test(safe)) return '';
  return '<a class="contact-option" href="' + esc(safe) + '"' + (type === 'email' ? '' : ' target="_blank" rel="noopener noreferrer"') + '>' + esc(label) + '<small>' + T.common.open + '</small></a>';
}

/* ---- Cartes projets ---- */
function projectCards(list) {
  return '<div class="cards">' + list.map(p => {
    const idx = data.projects.indexOf(p), n = idx + 1;
    const art = '<div class="project-art ' + (idx % 2 ? 'web' : '') + '" aria-hidden="true">' + (p.images.length ? '<img class="project-preview" src="assets/' + esc(p.images[0][0]) + '.webp" alt="" loading="lazy">' : '') + '<span class="code">' + (idx % 2 ? '&lt;/&gt;' : '{ }') + '</span><span class="number">0' + n + '</span></div>';
    const foot = p.state === 'upcoming' ? '<span class="text-link">' + T.common.comingSoon + '</span>' : '<button class="text-link" data-project="' + esc(p.id) + '">' + T.common.viewMission + '</button>';
    return '<article class="card">' + art + '<div class="card-body"><div class="eyebrow">MISSION 0' + n + ' / ' + esc(projectContext(p)) + (p.year ? ' · ' + esc(p.year) : '') + '</div><h3>' + esc(tf(p.name)) + '</h3><p>' + esc(tf(p.description)) + '</p>' + tags(p.tech) + '<div class="status">' + esc(T.status[p.state]) + '</div>' + foot + '</div></article>';
  }).join('') + '</div>';
}
function projectGroups() {
  return [['academique'], ['personnel'], ['a-preciser']].map(([key]) => {
    const items = data.projects.filter(p => key === 'a-preciser' ? p.state === 'upcoming' : (p.context === key && p.state !== 'upcoming'));
    if (!items.length) return '';
    return '<section class="project-category"><h2>' + esc(T.projectCat[key]) + '</h2>' + projectCards(items) + '</section>';
  }).join('');
}

/* ---- Vues ---- */
const views = {
  accueil: () => '<section class="hero"><div class="welcome">' + esc(T.home.welcome) + '</div><h1><span class="hero-first">' + esc(T.home.h1a) + '</span><span class="hero-second"><em>' + esc(T.home.h1b) + '</em></span></h1><p class="hero-subtitle">' + esc(T.home.subtitle) + '</p><p class="intro">' + esc(T.home.intro) + '</p><div class="actions"><a class="btn" href="#projets">' + esc(T.home.discover) + ' <span>→</span></a><a class="btn secondary" href="#contact">' + esc(T.home.contact) + '</a></div><div class="mission"><div class="eyebrow">' + esc(T.home.missionEyebrow) + '</div><h3>' + esc(T.home.missionTitle) + '</h3><div class="mission-line" aria-hidden="true"><span></span></div><p>' + esc(T.home.missionText) + '</p></div></section>',
  profil: () => '<div class="section-index">' + esc(T.profil.index) + '</div><h1>' + esc(T.profil.h1) + '</h1><div class="about-grid"><div class="panel"><h3>' + T.profil.panelH3 + '</h3><p>' + esc(T.profil.p1) + '</p><p>' + esc(T.profil.p2) + '</p><p>' + esc(T.profil.p3) + '</p>' + tags(T.profil.tags) + '</div><div class="panel profile-data"><div><small>' + esc(T.profil.fEducation) + '</small>' + esc(T.profil.vEducation) + '</div><div><small>' + esc(T.profil.fTrack) + '</small>' + esc(T.profil.vTrack) + '</div><div><small>' + esc(T.profil.fLocation) + '</small>' + esc(T.profil.vLocation) + '</div><div><small>' + esc(T.profil.fAvailability) + '</small>' + esc(tf(data.availability)) + '</div></div></div>',
  projets: () => '<div class="section-index">' + esc(T.projets.index) + '</div><h1>' + esc(T.projets.h1) + '</h1><p class="intro">' + esc(T.projets.intro) + '</p>' + projectGroups(),
  competences: () => '<div class="section-index">' + esc(T.competences.index) + '</div><h1>' + T.competences.h1 + '</h1>' + Object.entries(data.skills).map(([cat, items]) => '<section class="skill-group"><h3>' + esc(T.skillCat[cat]) + '</h3><div class="skills-grid">' + items.map(x => '<div class="skill">' + skillLogo(x) + '<span>' + esc(x) + '</span></div>').join('') + '</div></section>').join(''),
  parcours: () => '<div class="section-index">' + esc(T.parcours.index) + '</div><h1>' + T.parcours.h1 + '</h1><p class="intro">' + esc(T.parcours.intro) + '</p><article class="formation-card"><div class="formation-icon">' + uiIcon('competences') + '</div><div><span class="eyebrow">' + esc(T.parcours.eduEyebrow) + ' · ' + esc(data.education.period) + '</span><h2>' + esc(tf(data.education.title)) + '</h2><p>' + esc(tf(data.education.description)) + '</p>' + tags(tf(data.education.tags)) + '</div></article><h2 class="journey-title">' + esc(T.parcours.journeyTitle) + '</h2><p class="journey-hint">' + esc(T.parcours.journeyHint) + '</p><div class="project-journal">' + data.projects.filter(p => p.state !== 'upcoming').slice().sort((a, b) => Number(b.year) - Number(a.year)).map(p => '<details class="journal-entry"><summary><span class="journal-year">' + esc(p.year) + '</span><span class="journal-heading"><small>' + esc(projectContext(p)) + '</small><strong>' + esc(tf(p.name)) + '</strong></span><span class="journal-plus" aria-hidden="true">+</span></summary><div class="journal-body"><p>' + esc(tf(p.description)) + '</p>' + tags(p.tech) + '<h3>' + esc(T.parcours.delivers) + '</h3><ul>' + p.features.map(([title, d]) => '<li><strong>' + esc(tf(title)) + '</strong><span>' + esc(tf(d)) + '</span></li>').join('') + '</ul><h3>' + esc(T.parcours.devChallenges) + '</h3><p>' + p.challenges.map(([title]) => esc(tf(title))).join(' · ') + '</p><button class="btn secondary" data-project="' + esc(p.id) + '">' + T.common.explore + '</button></div></details>').join('') + '</div>',
  contact: () => '<div class="section-index">' + esc(T.contact.index) + '</div><h1>' + T.contact.h1 + '</h1><p class="intro">' + esc(T.contact.intro) + '</p><div class="contact-options">' + personalLink('email', T.contact.email) + (data.github ? personalLink('github', T.contact.github) : '') + (data.linkedin ? personalLink('linkedin', T.contact.linkedin) : '') + (data.cv ? personalLink('cv', T.contact.cv) : '') + '</div>',
  galerie: () => '<div class="section-index">' + esc(T.galerie.index) + '</div><h1>' + esc(T.galerie.h1) + '</h1>' + data.projects.filter(p => p.images.length).map(p => '<h3>' + esc(tf(p.name)) + '</h3>' + gallery(p)).join('')
};

function homeAbout() {
  const h = T.home;
  return '<section class="home-about"><div class="about-heading"><span class="chapter-number">01.</span><h2>' + esc(h.aboutH2) + '</h2><span class="chapter-label">' + esc(h.aboutLabel) + '</span></div><div class="about-layout"><div class="about-scene" role="img" aria-label="' + esc(h.aboutH2) + '"><span>' + h.aboutScene + '</span></div><div class="about-copy"><p>' + esc(h.aboutP1) + '</p><p>' + esc(h.aboutP2) + '</p><a class="text-link" href="#profil">' + esc(h.aboutLink) + '</a></div><div class="about-facts"><div>' + uiIcon('competences') + '<small>' + esc(h.factEducation) + '</small><strong>' + esc(T.profil.vEducation) + '</strong><span>' + esc(h.valueEducationSub) + '</span></div><div>' + uiIcon('accueil') + '<small>' + esc(h.factLocation) + '</small><strong>' + esc(h.valueLocation) + '</strong></div><div>' + uiIcon('parcours') + '<small>' + esc(h.factAvailability) + '</small><strong>' + esc(h.valueAvailability) + '</strong><span>' + esc(h.valueAvailabilitySub) + '</span></div><div>' + uiIcon('projets') + '<small>' + esc(h.factInterests) + '</small><strong>' + esc(h.valueInterests) + '</strong><span>' + esc(h.valueInterestsSub) + '</span></div></div></div></section>';
}

/* ---- Routeur / rendu ---- */
function render() {
  const aliases = { apropos: 'profil', skills: 'competences', experience: 'parcours', about: 'profil', projects: 'projets', journey: 'parcours', gallery: 'galerie', home: 'accueil' };
  const hash = location.hash.slice(1);
  if (hash === 'content') { $('#content').focus(); return; }
  const id = aliases[hash] || hash;
  current = views[id] ? id : 'accueil';
  document.body.dataset.view = current;
  $('#content').innerHTML = '<div class="view">' + views[current]() + (current === 'accueil' ? homeAbout() : '') + '</div>';
  document.title = T.nav[current] + ' · Developer Mode';
  document.querySelectorAll('[data-section]').forEach(el => { const active = el.dataset.section === current; el.classList.toggle('active', active); active ? el.setAttribute('aria-current', 'page') : el.removeAttribute('aria-current'); });
  $('.sidebar').classList.remove('open'); $('.hamburger').setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
}
function renderNav() {
  $('#navigation').innerHTML = sectionIds.map(id => '<a class="nav-link" href="#' + id + '" data-section="' + id + '"><span class="nav-symbol" aria-hidden="true">' + uiIcon(id) + '</span>' + T.nav[id].toUpperCase() + '</a>').join('');
  $('#markers').innerHTML = sectionIds.map((id, i) => '<button class="marker" data-section="' + id + '" style="left:' + markerPos[i][0] + '%;top:' + markerPos[i][1] + '%" aria-label="' + esc(T.nav[id]) + '" title="' + esc(T.nav[id]) + '">' + uiIcon(id) + '</button>').join('');
}

/* ---- Téléphone DEV.OS ---- */
function phoneHome() {
  const apps = ['profil', 'projets', 'competences', 'parcours', 'galerie', 'contact'];
  $('#phone-content').innerHTML = '<div class="phone-body"><div class="phone-logo">DEV.OS</div><p class="phone-subtitle">' + esc(T.phone.subtitle) + '</p><div class="apps">' + apps.map(id => '<button class="app" data-app="' + id + '"><span class="app-icon" aria-hidden="true">' + uiIcon(id) + '</span>' + esc(T.phoneApps[id]) + '</button>').join('') + '</div><div class="phone-notice"><strong>' + esc(T.phone.notifications) + ' <span class="notice-heading">DEV.OS</span></strong><div class="notice-row">▣   ' + esc(T.phone.n1t) + '<small>' + esc(T.phone.n1d) + '</small></div><div class="notice-row">⌘   ' + esc(T.phone.n2t) + '<small>' + esc(T.phone.n2d) + '</small></div></div><p class="phone-motto">' + T.phone.motto + '</p></div>';
}
function phoneApp(id) {
  beep(); const V = T.phoneViews; let c = '';
  if (id === 'projets') c = '<h3>' + esc(V.myProjects) + '</h3>' + data.projects.filter(p => p.state !== 'upcoming').map(p => '<button class="phone-item" data-project="' + p.id + '">' + esc(tf(p.name)) + ' ↗</button>').join('');
  else if (id === 'profil') c = '<h3>' + esc(V.myProfile) + '</h3><p>' + V.profileLine + '</p><p>' + esc(V.internship) + '</p><a class="phone-item" href="#profil">' + esc(V.fullProfile) + '</a>';
  else if (id === 'competences') c = '<h3>' + esc(V.techs) + '</h3><div class="phone-tags">' + Object.values(data.skills).flat().map(x => '<span>' + skillLogo(x) + esc(x) + '</span>').join('') + '</div>';
  else if (id === 'parcours') c = '<h3>' + esc(V.myJourney) + '</h3><p>' + V.journeyLine + '</p><a class="phone-item" href="#parcours">' + esc(V.discoverJourney) + '</a>';
  else if (id === 'galerie') c = '<h3>' + esc(V.gallery) + '</h3>' + data.projects.filter(p => p.images.length).map(p => '<p>' + esc(tf(p.name)) + '</p>' + gallery(p)).join('');
  else c = '<h3>' + esc(V.contact) + '</h3>' + personalLink('email', 'Email') + (data.github ? personalLink('github', 'GitHub') : '') + (data.linkedin ? personalLink('linkedin', 'LinkedIn') : '') + (data.cv ? personalLink('cv', T.contact.cv.replace(' ↗', '')) : '');
  $('#phone-content').innerHTML = '<div class="phone-body"><button class="phone-back" data-home>← ' + esc(T.phone.back) + '</button>' + c + '</div>';
}
function togglePhone(force) { const show = force ?? $('#phone').classList.contains('hidden'); $('#phone').classList.toggle('hidden', !show); $('#phone').inert = !show; $('#phone-toggle').setAttribute('aria-expanded', String(show)); if (show) $('#phone-home').focus(); }

/* ---- Pop-up projet ---- */
let trigger, pdImages = [], pdIndex = 0;
function pdShow(i) {
  if (!pdImages.length) return; pdIndex = (i + pdImages.length) % pdImages.length;
  const [file, label] = pdImages[pdIndex], cap = tf(label), img = $('#pd-hero-img');
  if (img) { img.src = 'assets/' + file + '.webp'; img.alt = cap; img.dataset.image = 'assets/' + file + '.webp'; img.dataset.caption = cap; }
  const c = $('#pd-hero-cap'); if (c) c.textContent = cap;
  document.querySelectorAll('#pd-thumbs .pd-thumb').forEach((b, j) => b.classList.toggle('active', j === pdIndex));
  const act = document.querySelector('#pd-thumbs .pd-thumb.active'); if (act) act.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
function openProject(id) {
  const p = data.projects.find(p => p.id === id); if (!p || p.state === 'upcoming') return;
  trigger = document.activeElement; beep(); pdImages = p.images || []; pdIndex = 0;
  const cls = stateCss(p.state), ctx = projectContext(p), D = T.dialog;
  const hero = pdImages.length ? '<figure class="pd-hero"><img id="pd-hero-img" src="assets/' + esc(pdImages[0][0]) + '.webp" alt="' + esc(tf(pdImages[0][1])) + '" data-image="assets/' + esc(pdImages[0][0]) + '.webp" data-caption="' + esc(tf(pdImages[0][1])) + '"><figcaption id="pd-hero-cap">' + esc(tf(pdImages[0][1])) + '</figcaption><span class="pd-hero-zoom" aria-hidden="true">⤢</span></figure>' + (pdImages.length > 1 ? '<div class="pd-carousel"><button class="pd-arrow" data-pd-step="-1" aria-label="◄">‹</button><div class="pd-thumbs" id="pd-thumbs">' + pdImages.map((im, i) => '<button class="pd-thumb' + (i ? '' : ' active') + '" data-pd-thumb="' + i + '" aria-label="' + esc(tf(im[1])) + '"><img src="assets/' + esc(im[0]) + '.webp" alt="" loading="lazy"></button>').join('') + '</div><button class="pd-arrow" data-pd-step="1" aria-label="►">›</button></div>' : '') : '';
  const feats = p.features.length ? '<div class="pd-section-title">' + esc(D.features) + '</div><div class="pd-features">' + p.features.map(([n, t]) => '<div class="pd-feat"><span class="pd-feat-ic">' + featureIcon(tf(n)) + '</span><div><strong>' + esc(tf(n)) + '</strong><span>' + esc(tf(t)) + '</span></div></div>').join('') + '</div>' : '';
  const chal = p.challenges.length ? '<div class="pd-section-title">' + esc(D.challenges) + '</div><ul class="pd-challenges">' + p.challenges.map(([n, t]) => '<li><strong>' + esc(tf(n)) + '</strong><span>' + esc(tf(t)) + '</span></li>').join('') + '</ul>' : '';
  const roles = p.roles ? '<div class="pd-section-title">' + esc(D.roles) + '</div><div class="pd-roles">' + p.roles.map(([n, t]) => '<div class="pd-role"><strong>' + esc(tf(n)) + '</strong><span>' + esc(tf(t)) + '</span></div>').join('') + '</div>' : '';
  const rail = '<aside class="pd-rail"><div class="pd-rail-card"><h4>' + esc(D.technologies) + '</h4><ul class="pd-tech">' + p.tech.map(techItem).join('') + '</ul></div><div class="pd-rail-card pd-meta"><div><small>' + esc(D.type) + '</small><span>' + esc(ctx) + '</span></div>' + (p.year ? '<div><small>' + esc(D.year) + '</small><span>' + esc(p.year) + '</span></div>' : '') + '<div><small>' + esc(D.status) + '</small><span class="pd-dot ' + cls + '">' + esc(T.status[p.state]) + '</span></div></div>' + (p.github ? '<a class="pd-github" href="' + esc(p.github) + '" target="_blank" rel="noopener noreferrer">' + esc(D.viewGithub) + ' <span aria-hidden="true">›</span></a>' : '') + '<button class="pd-back" data-close>' + esc(T.common.backToMissions) + '</button></aside>';
  $('#project-content').innerHTML = '<div class="pd"><div class="pd-eyebrow">' + esc(D.eyebrow) + '</div><div class="pd-titlerow"><h2 class="pd-title">' + esc(tf(p.name)) + '</h2><span class="pd-sub">' + esc(ctx) + (p.year ? ' · ' + esc(p.year) : '') + '</span><span class="pd-badge ' + cls + '">' + esc(T.status[p.state]) + '</span></div><div class="pd-grid"><div class="pd-main">' + hero + '<p class="pd-desc">' + esc(tf(p.description)) + '</p>' + feats + chal + roles + '</div>' + rail + '</div><div class="pd-foot"><span>' + esc(D.foot) + '</span><span>v0.1.0</span></div></div>';
  $('#project-dialog').showModal();
}

/* ---- Son / notifications ---- */
function beep() { if (!sound) return; try { audio ??= new (window.AudioContext || window.webkitAudioContext)(); const o = audio.createOscillator(), g = audio.createGain(); o.connect(g); g.connect(audio.destination); o.frequency.value = 600; g.gain.setValueAtTime(.025, audio.currentTime); g.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .07); o.start(); o.stop(audio.currentTime + .08); } catch {} }
function notify(msg) { clearTimeout(toastTimer); const t = $('#toast'); t.textContent = msg; t.classList.add('visible'); toastTimer = setTimeout(() => t.classList.remove('visible'), 3500); }

/* ---- Horloge ---- */
function updateClock() { const d = new Date(), loc = lang === 'fr' ? 'fr-FR' : 'en-GB'; $('#clock').textContent = new Intl.DateTimeFormat(loc, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(d); $('#phone-time').textContent = new Intl.DateTimeFormat(loc, { hour: '2-digit', minute: '2-digit' }).format(d); }

/* ---- Réglages (rebâtis à chaque langue) ---- */
function buildSettings() {
  const S = T.settingsDialog, dlg = $('#settings-dialog');
  dlg.querySelector('.eyebrow').textContent = S.eyebrow;
  dlg.querySelector('h2').textContent = S.title;
  const labels = dlg.querySelectorAll('label');
  labels[0].innerHTML = '<input type="checkbox" id="motion"> ' + esc(S.motion);
  labels[1].innerHTML = '<input type="checkbox" id="sound"> ' + esc(S.sound);
  dlg.querySelector('p').textContent = S.note;
  // (re)brancher les contrôles
  let motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { const s = localStorage.getItem('portfolio-motion'); if (s !== null) motion = s === 'true'; } catch {}
  const mi = $('#motion'); mi.checked = motion; document.body.classList.toggle('no-motion', !motion);
  mi.onchange = e => { document.body.classList.toggle('no-motion', !e.target.checked); try { localStorage.setItem('portfolio-motion', e.target.checked); } catch {} };
  const si = $('#sound'); si.checked = sound; si.onchange = e => { sound = e.target.checked; beep(); };
}

/* ---- Chrome statique traduit ---- */
function applyChrome() {
  document.documentElement.lang = T.htmlLang;
  $('.skip').textContent = T.skip;
  $('#settings').innerHTML = '⚙ <span>' + esc(T.settings) + '</span>';
  $('#lang-toggle').textContent = T.switchTo;
  $('#lang-toggle').setAttribute('aria-label', T.switchTo);
  $('.hamburger').firstChild ? $('.hamburger').childNodes[0].textContent = T.menu + ' ☰' : null;
  $('.map-wrap .eyebrow').innerHTML = esc(T.map.eyebrow) + ' <span>N ↑</span>';
  $('.map-caption').textContent = T.map.caption;
  $('.sidebar-motto').innerHTML = T.map.motto;
  $('.footer-hint').innerHTML = '<kbd>' + esc(T.keysRange) + '</kbd> ' + esc(T.footerNav) + ' <kbd>' + esc(T.keyEsc) + '</kbd> ' + esc(T.footerBack);
  const deg = document.querySelector('.hud-bottom small'); if (deg) deg.textContent = T.degree;
  document.querySelectorAll('.map-legend a').forEach(a => { const key = a.getAttribute('href').slice(1); const span = a.querySelector('span'); if (span && T.nav[key]) span.textContent = T.nav[key]; });
}

function applyLang() {
  T = window.I18N[lang];
  try { localStorage.setItem('portfolio-lang', lang); } catch {}
  applyChrome(); buildSettings(); renderNav(); render(); phoneHome();
}
function toggleLang() { lang = lang === 'en' ? 'fr' : 'en'; applyLang(); }

/* ---- Événements ---- */
$('#lang-toggle').onclick = toggleLang;
$('.hamburger').onclick = () => { const open = $('.sidebar').classList.toggle('open'); $('.hamburger').setAttribute('aria-expanded', String(open)); };
$('#settings').onclick = () => $('#settings-dialog').showModal();
$('#phone-toggle').onclick = () => togglePhone();
$('.phone-close').onclick = () => { togglePhone(false); $('#phone-toggle').focus(); };
$('#phone-home').onclick = phoneHome;
window.addEventListener('hashchange', () => { render(); beep(); });

document.addEventListener('click', e => {
  const shot = e.target.closest('[data-image]');
  if (shot) { const grid = shot.closest('.gallery-grid'); activeShots = grid ? [...grid.querySelectorAll('[data-image]')] : [shot]; activeShot = Math.max(0, activeShots.indexOf(shot)); showGalleryImage(); $('#image-dialog').showModal(); }
  const th = e.target.closest('[data-pd-thumb]'); if (th) pdShow(Number(th.dataset.pdThumb));
  const st = e.target.closest('[data-pd-step]'); if (st) pdShow(pdIndex + Number(st.dataset.pdStep));
  const project = e.target.closest('[data-project]'); if (project) openProject(project.dataset.project);
  const marker = e.target.closest('button[data-section]'); if (marker) location.hash = marker.dataset.section;
  const app = e.target.closest('[data-app]'); if (app) phoneApp(app.dataset.app);
  if (e.target.closest('[data-home]')) phoneHome();
  if (e.target.closest('[data-close]')) $('#project-dialog').close();
  if (e.target.closest('.dialog-close')) e.target.closest('dialog').close();
  const link = e.target.closest('.phone a'); if (link && innerWidth < 768) togglePhone(false);
});
$('#project-dialog').addEventListener('close', () => trigger?.focus());
document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) { const r = d.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close(); } }));
document.addEventListener('keydown', e => {
  if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.ctrlKey || e.altKey || e.metaKey) return;
  if (document.querySelector('dialog[open]')) return;
  if (e.key === 'Escape') { togglePhone(false); $('.sidebar').classList.remove('open'); $('.hamburger').setAttribute('aria-expanded', 'false'); }
  const n = Number(e.key); if (n >= 1 && n <= 7) location.hash = sectionIds[n - 1];
});

/* ---- Galerie plein écran ---- */
let activeShots = [], activeShot = 0;
const imageDialog = $('#image-dialog');
const imageControls = document.createElement('div');
imageControls.className = 'image-controls';
imageControls.innerHTML = '<button class="btn secondary" data-gallery-step="-1" aria-label="◄">←</button><span id="image-counter" aria-live="polite"></span><button class="btn secondary" data-gallery-step="1" aria-label="►">→</button>';
imageDialog.append(imageControls);
function showGalleryImage(step = 0) {
  if (!activeShots.length) return; activeShot = (activeShot + step + activeShots.length) % activeShots.length;
  const s = activeShots[activeShot];
  $('#full-image').src = s.dataset.image; $('#full-image').alt = s.dataset.caption; $('#image-caption').textContent = s.dataset.caption;
  $('#image-counter').textContent = (activeShot + 1) + ' / ' + activeShots.length;
}
document.addEventListener('click', e => { const c = e.target.closest('[data-gallery-step]'); if (c) showGalleryImage(Number(c.dataset.galleryStep)); });
imageDialog.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); showGalleryImage(e.key === 'ArrowLeft' ? -1 : 1); } });

/* ---- Analytics (chargé seulement si configuré, sans cookie) ---- */
if (data.analytics) { const s = document.createElement('script'); s.async = true; s.dataset.goatcounter = data.analytics; s.src = 'https://gc.zgo.at/count.js'; document.body.appendChild(s); }

/* ---- Init ---- */
$('#year').textContent = new Date().getFullYear();
applyLang();
updateClock(); setInterval(updateClock, 60000);
if (innerWidth <= 1023) togglePhone(false);
setTimeout(() => notify(T.toastStart), 2400);
const initialProject = location.pathname.endsWith('/demon-realm.html') ? 'demon-realm' : location.pathname.endsWith('/asso-manager.html') ? 'assomanager' : null;
if (initialProject) { location.hash = 'projets'; render(); openProject(initialProject); }
