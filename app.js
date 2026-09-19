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
function gallery(p) { return '<div class="gallery-grid">' + p.images.map(([file, label]) => '<button class="gallery-shot" data-image="assets/' + file + '.webp" data-caption="' + esc(tf(label)) + '"><img src="assets/' + file + '.webp" alt="' + esc(tf(label)) + '" loading="lazy"><span>' + esc(tf(label)) + '</span></button>').join('') + '</div>'; }
function contactForm(compact) {
  const C = T.contact, prefix = compact ? 'phone-message' : 'contact-message';
  return '<form class="message-form' + (compact ? ' message-form-compact' : '') + '" data-contact-form novalidate>' +
    '<div class="message-form-heading"><span>' + uiIcon('contact') + '</span><div><small>' + esc(C.formSmall) + '</small><h3>' + esc(C.formTitle) + '</h3></div></div>' +
    '<div class="message-fields"><label for="' + prefix + '-name">' + esc(C.fName) + '<input id="' + prefix + '-name" name="name" autocomplete="name" required maxlength="100" placeholder="' + esc(C.phName) + '"></label>' +
    '<label for="' + prefix + '-email">' + esc(C.fEmail) + '<input id="' + prefix + '-email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="' + esc(C.phEmail) + '"></label></div>' +
    '<label for="' + prefix + '-body">' + esc(C.fMessage) + '<textarea id="' + prefix + '-body" name="message" required minlength="10" maxlength="5000" rows="' + (compact ? 4 : 6) + '" placeholder="' + esc(C.phMessage) + '"></textarea></label>' +
    '<div class="message-trap" aria-hidden="true"><label>' + esc(C.trap) + '<input name="website" tabindex="-1" autocomplete="off"></label></div>' +
    '<p class="message-privacy">' + esc(C.privacy) + '</p>' +
    '<button class="btn message-send" type="submit">' + esc(C.send) + ' <span aria-hidden="true">↗</span></button>' +
    '<p class="message-status" role="status" aria-live="polite"></p>' +
    (data.contactEndpoint ? '' : '<p class="message-setup">' + esc(C.setup) + '</p>') +
    '</form>';
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
  parcours: () => {
    const P2 = T.parcours, ed = data.education;
    const journal = data.projects.filter(p => p.state !== 'upcoming').slice().sort((a, b) => Number(b.year) - Number(a.year)).map(p => '<details class="journal-entry"><summary><span class="journal-year">' + esc(p.year) + '</span><span class="journal-heading"><small>' + esc(projectContext(p)) + '</small><strong>' + esc(tf(p.name)) + '</strong></span><span class="journal-plus" aria-hidden="true">+</span></summary><div class="journal-body"><p>' + esc(tf(p.description)) + '</p>' + tags(p.tech) + '<h3>' + esc(P2.delivers) + '</h3><ul>' + p.features.map(([t2, d]) => '<li><strong>' + esc(tf(t2)) + '</strong><span>' + esc(tf(d)) + '</span></li>').join('') + '</ul><h3>' + esc(P2.devChallenges) + '</h3><p>' + p.challenges.map(([t2]) => esc(tf(t2))).join(' · ') + '</p><button class="btn secondary" data-project="' + esc(p.id) + '">' + esc(T.common.explore) + '</button></div></details>').join('');
    return '<div class="section-index">' + esc(P2.index) + '</div><div class="journey-intro"><h1>' + esc(P2.h1) + '</h1><p class="intro">' + esc(P2.intro) + '</p></div>'
      + '<section class="learning-card"><div class="learning-heading"><span class="learning-symbol">' + uiIcon('competences') + '</span><div><div class="eyebrow">' + esc(ed.period) + ' · ' + esc(P2.eduTag) + '</div><h2>' + esc(tf(ed.title)) + '</h2><p>' + esc(P2.track) + '</p></div><span class="learning-current">' + esc(P2.currentYear) + '</span></div>'
      + '<ol class="learning-years">' + P2.years.map(([yr, lbl], i) => '<li' + (i === P2.years.length - 1 ? ' aria-current="step"' : '') + '><span>0' + (i + 1) + '</span><strong>' + esc(yr) + '</strong><small>' + esc(lbl) + '</small></li>').join('') + '</ol>'
      + '<div class="learning-domains">' + tags(P2.domains) + '</div></section>'
      + '<div class="journey-section-heading"><div><span class="eyebrow">' + esc(P2.practiceEyebrow) + '</span><h2>' + esc(P2.practiceTitle) + '</h2></div><span class="journey-count">' + esc(P2.practiceCount) + '</span></div>'
      + '<p class="journey-hint">' + esc(P2.journeyHint) + '</p><div class="project-journal">' + journal + '</div>'
      + '<section class="next-mission"><span class="next-mission-icon">' + uiIcon('parcours') + '</span><div><span class="eyebrow">' + esc(P2.nextEyebrow) + '</span><h2>' + esc(P2.nextTitle) + '</h2><p>' + P2.nextText + '</p></div><a class="btn" href="#contact">' + esc(P2.nextCta) + '</a></section>';
  },
  contact: () => '<div class="section-index">' + esc(T.contact.index) + '</div><h1>' + esc(T.contact.h1) + '</h1><p class="intro">' + esc(T.contact.intro) + '</p>' + contactForm(false) + (data.github ? '<div class="contact-alternatives"><a href="' + esc(data.github) + '" target="_blank" rel="noopener noreferrer">' + uiIcon('projets') + '<span>' + esc(T.contact.ghLabel) + '<small>' + esc(T.contact.ghAlt) + '</small></span></a></div>' : ''),
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
  else if (id === 'parcours') c = '<h3>' + esc(V.myJourney) + '</h3>' + V.journeySteps.map(([a, b, d]) => '<div class="phone-journey-step"><small>' + esc(a) + '</small><strong>' + esc(b) + '</strong><span>' + esc(d) + '</span></div>').join('') + '<a class="phone-item" href="#parcours">' + esc(V.discoverJourney) + '</a>';
  else if (id === 'galerie') c = '<h3>' + esc(V.gallery) + '</h3>' + data.projects.filter(p => p.images.length).map(p => '<p>' + esc(tf(p.name)) + '</p>' + gallery(p)).join('');
  else c = contactForm(true);
  $('#phone-content').innerHTML = '<div class="phone-body"><button class="phone-back" data-home>← ' + esc(T.phone.back) + '</button>' + c + '</div>';
}
function togglePhone(force) { const show = force ?? $('#phone').classList.contains('hidden'); $('#phone').classList.toggle('hidden', !show); $('#phone').inert = !show; $('#phone-toggle').setAttribute('aria-expanded', String(show)); if (show) $('#phone-home').focus(); }

/* ---- Pop-up projet — dossier de mission (onglets) ---- */
let trigger, dossierProject = null, dossierIndex = 0;
const dossierFeatIcons = ['accueil', 'competences', 'projets', 'parcours'];
function openProject(id) {
  const p = data.projects.find(x => x.id === id); if (!p || p.state === 'upcoming') return;
  trigger = document.activeElement; dossierProject = p; dossierIndex = 0; beep();
  const D = T.dialog, dlg = $('#project-dialog'), cls = stateCss(p.state), ctx = projectContext(p);
  const n = String(data.projects.indexOf(p) + 1).padStart(2, '0'), imgs = p.images || [];
  const [f0, l0] = imgs.length ? imgs[0] : ['', ''];
  const header = '<header class="dossier-header"><div><div class="eyebrow">' + esc(D.eyebrow) + ' / ' + n + '</div><h2 id="dossier-title">' + esc(tf(p.name)) + '</h2><p>' + esc(ctx) + (p.year ? ' <span>·</span> ' + esc(p.year) : '') + '</p></div><span class="dossier-status ' + cls + '">' + esc(T.status[p.state]) + '</span></header>';
  const media = imgs.length ? '<section class="dossier-media" aria-label="' + esc(D.capturesTitle) + '"><div class="dossier-stage"><img id="dossier-image" src="assets/' + esc(f0) + '.webp" alt="' + esc(tf(l0)) + '"><div class="dossier-image-shade"></div><span class="dossier-screen-label">' + esc(D.onField) + '</span><div class="dossier-caption"><span id="dossier-caption">' + esc(tf(l0)) + '</span><span id="dossier-count" aria-live="polite">1 / ' + imgs.length + '</span></div>' + (imgs.length > 1 ? '<button class="dossier-arrow previous" data-dossier-step="-1" aria-label="◄">‹</button><button class="dossier-arrow next" data-dossier-step="1" aria-label="►">›</button>' : '') + '</div>' + (imgs.length > 1 ? '<div class="dossier-thumbnails">' + imgs.map(([file, label], i) => '<button data-dossier-image="' + i + '" aria-label="' + esc(tf(label)) + '" aria-pressed="' + (i === 0) + '"><img src="assets/' + esc(file) + '.webp" alt="" loading="lazy"><span>' + String(i + 1).padStart(2, '0') + '</span></button>').join('') + '</div>' : '') + '</section>' : '';
  const tabDefs = [['overview', D.tabOverview], ['technical', D.tabTechnical]];
  if (imgs.length) tabDefs.push(['gallery', D.tabGallery]);
  const tabs = '<div class="dossier-tabs" role="tablist" aria-label="' + esc(tf(p.name)) + '">' + tabDefs.map(([key, label], i) => '<button id="dossier-tab-' + key + '" role="tab" aria-selected="' + (i === 0) + '" aria-controls="dossier-panel-' + key + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-dossier-tab="' + key + '">' + esc(label) + '</button>').join('') + '</div>';
  const overview = '<section id="dossier-panel-overview" role="tabpanel" aria-labelledby="dossier-tab-overview" tabindex="0"><p class="dossier-description">' + esc(tf(p.description)) + '</p><div class="dossier-features">' + p.features.map(([t2, d], i) => '<article class="dossier-feature"><span class="feature-symbol">' + uiIcon(dossierFeatIcons[i % 4]) + '</span><div><h3>' + esc(tf(t2)) + '</h3><p>' + esc(tf(d)) + '</p></div></article>').join('') + '</div></section>';
  const technical = '<section id="dossier-panel-technical" role="tabpanel" aria-labelledby="dossier-tab-technical" tabindex="0" hidden><div class="eyebrow">' + esc(D.techChoices) + '</div>' + p.challenges.map(([t2, d], i) => '<article class="technical-entry"><span>' + String(i + 1).padStart(2, '0') + '</span><div><h3>' + esc(tf(t2)) + '</h3><p>' + esc(tf(d)) + '</p></div></article>').join('') + (p.roles ? '<h3 class="dossier-role-title">' + esc(D.roles) + '</h3>' + p.roles.map(([t2, d]) => '<details class="dossier-role"><summary>' + esc(tf(t2)) + '</summary><p>' + esc(tf(d)) + '</p></details>').join('') : '') + '</section>';
  const galleryPanel = imgs.length ? '<section id="dossier-panel-gallery" role="tabpanel" aria-labelledby="dossier-tab-gallery" tabindex="0" hidden><div class="eyebrow">' + esc(D.capturesTitle) + '</div>' + gallery(p) + '</section>' : '';
  const facts = '<aside class="dossier-facts"><small>' + esc(D.technologies) + '</small><div class="dossier-tech">' + p.tech.map(name => { const nm = tf(name); return '<span>' + (skillFiles[nm] ? skillLogo(nm) : uiIcon('competences')) + esc(nm) + '</span>'; }).join('') + '</div><small>' + esc(D.type) + '</small><p>' + esc(ctx) + '</p>' + (p.year ? '<small>' + esc(D.year) + '</small><p>' + esc(p.year) + '</p>' : '') + '<small>' + esc(D.status) + '</small><p class="fact-status ' + cls + '">' + esc(T.status[p.state]) + '</p></aside>';
  const footer = '<footer class="dossier-footer"><span>' + esc(D.footer) + '</span>' + (p.github ? '<a class="btn" href="' + esc(p.github) + '" target="_blank" rel="noopener noreferrer">' + esc(T.common.viewGithub) + ' ↗</a>' : '') + '<button class="btn secondary" data-close>' + esc(T.common.backToMissions) + '</button></footer>';
  $('#project-content').innerHTML = header + media + tabs + '<div class="dossier-layout"><div class="dossier-panels">' + overview + technical + galleryPanel + '</div>' + facts + '</div>' + footer;
  if (!dlg.open) dlg.showModal(); dlg.scrollTop = 0;
}
function showDossierImage(index) {
  if (!dossierProject || !dossierProject.images.length) return;
  dossierIndex = (index + dossierProject.images.length) % dossierProject.images.length;
  const [file, label] = dossierProject.images[dossierIndex], cap = tf(label), img = $('#dossier-image');
  if (img) { img.src = 'assets/' + file + '.webp'; img.alt = cap; }
  const c = $('#dossier-caption'); if (c) c.textContent = cap;
  const ct = $('#dossier-count'); if (ct) ct.textContent = (dossierIndex + 1) + ' / ' + dossierProject.images.length;
  document.querySelectorAll('[data-dossier-image]').forEach((b, i) => b.setAttribute('aria-pressed', String(i === dossierIndex)));
}
function selectDossierTab(key, focus) {
  document.querySelectorAll('[data-dossier-tab]').forEach(b => { const active = b.dataset.dossierTab === key; b.setAttribute('aria-selected', String(active)); b.tabIndex = active ? 0 : -1; const panel = $('#dossier-panel-' + b.dataset.dossierTab); if (panel) panel.hidden = !active; if (active && focus) b.focus(); });
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
  const project = e.target.closest('[data-project]'); if (project) openProject(project.dataset.project);
  const marker = e.target.closest('button[data-section]'); if (marker) location.hash = marker.dataset.section;
  const app = e.target.closest('[data-app]'); if (app) phoneApp(app.dataset.app);
  if (e.target.closest('[data-home]')) phoneHome();
  if (e.target.closest('[data-close]')) $('#project-dialog').close();
  if (e.target.closest('.dialog-close')) e.target.closest('dialog').close();
  const link = e.target.closest('.phone a'); if (link && innerWidth < 768) togglePhone(false);
});
$('#project-dialog').addEventListener('click', e => {
  const step = e.target.closest('[data-dossier-step]'); if (step) showDossierImage(dossierIndex + Number(step.dataset.dossierStep));
  const image = e.target.closest('[data-dossier-image]'); if (image) showDossierImage(Number(image.dataset.dossierImage));
  const tab = e.target.closest('[data-dossier-tab]'); if (tab) selectDossierTab(tab.dataset.dossierTab);
});
$('#project-dialog').addEventListener('keydown', e => {
  const tab = e.target.closest('[data-dossier-tab]');
  if (tab && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
    e.preventDefault();
    const keys = [...document.querySelectorAll('[data-dossier-tab]')].map(b => b.dataset.dossierTab);
    const i = keys.indexOf(tab.dataset.dossierTab);
    const next = e.key === 'Home' ? keys[0] : e.key === 'End' ? keys[keys.length - 1] : keys[(i + (e.key === 'ArrowRight' ? 1 : keys.length - 1)) % keys.length];
    selectDossierTab(next, true);
  } else if (e.target.closest('.dossier-media') && ['ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault(); showDossierImage(dossierIndex + (e.key === 'ArrowRight' ? 1 : -1));
  }
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

/* ---- Formulaire de contact ---- */
document.addEventListener('submit', async e => {
  const form = e.target.closest('[data-contact-form]'); if (!form) return;
  e.preventDefault();
  const C = T.contact, status = form.querySelector('.message-status'), button = form.querySelector('[type=submit]');
  if (button.disabled || !form.reportValidity()) return;
  if (form.elements.website.value) { status.textContent = C.stSpam; return; } // honeypot
  const endpoint = data.contactEndpoint;
  if (!endpoint) { status.textContent = C.stOff; return; }
  let url; try { url = new URL(endpoint, location.href); if (url.protocol !== 'https:' && url.origin !== location.origin) throw 0; } catch { status.textContent = C.stBad; return; }
  button.disabled = true; const label = button.innerHTML; button.textContent = C.stSending; status.textContent = '';
  const ctrl = new AbortController(), to = setTimeout(() => ctrl.abort(), 15000);
  try {
    const r = await fetch(url.href, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ name: form.elements.name.value.trim(), email: form.elements.email.value.trim(), message: form.elements.message.value.trim() }), signal: ctrl.signal });
    if (!r.ok) throw 0;
    form.reset(); status.textContent = C.stOk;
  } catch { status.textContent = C.stFail; }
  finally { clearTimeout(to); button.disabled = false; button.innerHTML = label; }
});

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
