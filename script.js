document.documentElement.classList.add('js');
const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const DEVICON = i => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${i}.svg`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ------------------------------------------------------------------ *
 * Menu mobile
 * ------------------------------------------------------------------ */
const nav = $('#gameNav');
const burger = $('#burger');
function closeNav() {
  if (!nav) return;
  nav.classList.remove('open');
  burger?.classList.remove('active');
  burger?.setAttribute('aria-expanded', 'false');
}
function toggleNav() {
  if (!nav) return;
  const open = nav.classList.toggle('open');
  burger?.classList.toggle('active', open);
  burger?.setAttribute('aria-expanded', String(open));
}
if (nav && burger) {
  burger.addEventListener('click', toggleNav);
  $('#openMapMobile')?.addEventListener('click', toggleNav);
  $$('.nav-link', nav).forEach(l => l.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
}

/* ------------------------------------------------------------------ *
 * Horloge (déco)
 * ------------------------------------------------------------------ */
const JOURS = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
const MOIS = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉC'];
function tick() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const date = `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
  const t = `${hh}:${mm}`;
  const setTxt = (sel, v) => { const el = $(sel); if (el) el.textContent = v; };
  setTxt('#hudDate', date);
  setTxt('#hudTime', t);
  setTxt('#phoneTime', t);
}
tick(); setInterval(tick, 15000);
const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ------------------------------------------------------------------ *
 * Scroll-spy : nav + marqueurs mini-map
 * ------------------------------------------------------------------ */
const sections = $$('main section[id]');
function setActive(id) {
  $$('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.section === id));
  $$('.marker').forEach(m => m.classList.toggle('active', m.dataset.target === id));
}
if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  sections.forEach(s => spy.observe(s));
}
$$('.marker').forEach(m => m.addEventListener('click', () => {
  const t = document.getElementById(m.dataset.target);
  if (t) t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
}));

/* ------------------------------------------------------------------ *
 * Rendu : Projets (missions)
 * ------------------------------------------------------------------ */
const projects = window.PORTFOLIO_PROJECTS || [];
function renderMissions() {
  const grid = $('#missionsGrid');
  if (!grid) return;
  grid.innerHTML = projects.map(p => {
    const locked = p.status === 'a-venir' || !p.page;
    const media = p.image
      ? `<div class="mission-media" style="--acc:${esc(p.accent || '#334')}"><img loading="lazy" decoding="async" src="${esc(p.image)}" alt="${esc(p.title)}"></div>`
      : `<div class="mission-media" style="--acc:${esc(p.accent || '#334')}">🔒</div>`;
    const foot = locked
      ? `<span class="mission-link" style="color:var(--text-dim)">Bientôt disponible</span>`
      : `<a class="mission-link" href="${esc(p.page)}">Voir la mission <span aria-hidden="true">→</span></a>
         ${p.github ? `<a class="mission-gh" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer" aria-label="Code de ${esc(p.title)} sur GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/></svg></a>` : ''}`;
    return `<article class="mission ${locked ? 'locked' : ''}">
      ${media}
      <span class="mission-tag">MISSION ${esc(p.mission)}</span>
      <span class="mission-status ${esc(p.status)}">${esc(p.statusLabel)}</span>
      <div class="mission-body">
        <div class="mission-cat">${esc(p.category)}</div>
        <h3 class="mission-title">${esc(p.title)}</h3>
        <p class="mission-desc">${esc(p.description)}</p>
        <div class="mission-tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <div class="mission-foot">${foot}</div>
      </div>
    </article>`;
  }).join('');
}

/* ------------------------------------------------------------------ *
 * Rendu : Compétences (inventaire)
 * ------------------------------------------------------------------ */
const skills = window.PORTFOLIO_SKILLS || {};
function skillIcon(s) {
  const initials = s.name.slice(0, 2).toUpperCase();
  return `<img src="${DEVICON(s.icon)}" alt="" width="30" height="30" loading="lazy"
     onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'sk-ph',textContent:'${initials}'}))">`;
}
function renderSkills() {
  const wrap = $('#skillsWrap');
  if (!wrap) return;
  wrap.innerHTML = Object.entries(skills).map(([group, items]) => `
    <div class="skill-group panel">
      <h3>${esc(group)}</h3>
      <div class="skill-items">
        ${items.map(s => `<div class="skill-item">${skillIcon(s)}<span>${esc(s.name)}</span></div>`).join('')}
      </div>
    </div>`).join('');
}

/* ------------------------------------------------------------------ *
 * Rendu : Expérience (timeline)
 * ------------------------------------------------------------------ */
const xp = window.PORTFOLIO_EXPERIENCE || [];
function renderTimeline() {
  const tl = $('#timeline');
  if (!tl) return;
  tl.innerHTML = xp.map(e => `
    <div class="tl-item">
      <div class="tl-head">
        <span class="tl-type">${esc(e.type)}</span>
        <span class="tl-year">${esc(e.year)}</span>
      </div>
      <h3 class="tl-title">${esc(e.title)}</h3>
      <p class="tl-desc">${esc(e.description)}</p>
      <div class="tl-tags">${(e.tags || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
    </div>`).join('');
}

/* ------------------------------------------------------------------ *
 * Rendu : Contact
 * ------------------------------------------------------------------ */
const contact = window.PORTFOLIO_CONTACT || {};
function renderContact() {
  const el = $('#contactActions');
  if (!el) return;
  const btns = [];
  if (contact.email) btns.push(`<a class="btn btn-primary" href="mailto:${esc(contact.email)}">Me contacter <span aria-hidden="true">→</span></a>`);
  if (contact.cv) btns.push(`<a class="btn btn-ghost" href="${esc(contact.cv)}" target="_blank" rel="noopener noreferrer">Voir mon CV</a>`);
  if (contact.github) btns.push(`<a class="btn btn-ghost" href="${esc(contact.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`);
  if (contact.linkedin) btns.push(`<a class="btn btn-ghost" href="${esc(contact.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`);
  el.innerHTML = btns.join('');
}

/* ------------------------------------------------------------------ *
 * Téléphone DEV.OS
 * ------------------------------------------------------------------ */
const phone = $('#phone');
const screen = $('#phoneScreen');
const APPS = [
  { id: 'profil', label: 'Profil', icon: '👤', c1: '#4da3ff', c2: '#7fe0ff' },
  { id: 'projets', label: 'Projets', icon: '📁', c1: '#f093fb', c2: '#f5576c' },
  { id: 'skills', label: 'Compétences', icon: '📊', c1: '#a06bff', c2: '#4da3ff' },
  { id: 'experience', label: 'Expérience', icon: '💼', c1: '#ff9d5c', c2: '#f5576c' },
  { id: 'galerie', label: 'Galerie', icon: '🖼️', c1: '#35e08a', c2: '#4da3ff' },
  { id: 'contact', label: 'Contact', icon: '✉️', c1: '#f5576c', c2: '#ff9d5c' }
];
function osHome() {
  screen.innerHTML = `<div class="os-view">
    <div class="os-head"><span class="os-title">DEV<small>.OS</small></span></div>
    <div class="app-grid">
      ${APPS.map(a => `<button class="app" data-app="${a.id}">
        <span class="ai" style="--ac1:${a.c1};--ac2:${a.c2}">${a.icon}</span>
        <span class="al">${a.label}</span></button>`).join('')}
    </div></div>`;
}
function osHeader(title) {
  return `<div class="os-head">
    <button class="os-back" data-app="home"><span aria-hidden="true">←</span> Retour</button>
    <span class="os-title" style="font-size:1rem">${esc(title)}</span></div>`;
}
function osApp(id) {
  if (id === 'home') return osHome();
  let body = '';
  if (id === 'profil') {
    body = `${osHeader('PROFIL')}
      <div class="os-field"><div class="fk">Formation</div><div class="fv">BUT Informatique</div></div>
      <div class="os-field"><div class="fk">Parcours</div><div class="fv">Réalisation d'applications</div></div>
      <div class="os-field"><div class="fk">Localisation</div><div class="fv">France</div></div>
      <div class="os-field"><div class="fk">Disponibilité</div><div class="fv" style="color:var(--green)">● Disponible pour un stage</div></div>`;
  } else if (id === 'projets') {
    body = `${osHeader('PROJETS')}<div class="os-list">
      ${projects.map(p => {
        const to = (p.page && p.status !== 'a-venir') ? `href="${esc(p.page)}"` : 'href="#projets" data-close-phone="1"';
        return `<a class="os-row" ${to}>
          <span class="r1">${esc(p.title)} <span class="os-chip ${esc(p.status)}">${esc(p.statusLabel)}</span></span>
          <span class="r2">${esc(p.category)}</span></a>`;
      }).join('')}</div>`;
  } else if (id === 'skills') {
    const flat = Object.values(skills).flat();
    body = `${osHeader('COMPÉTENCES')}<div class="os-list">
      ${Object.entries(skills).map(([g, items]) => `
        <div class="os-field"><div class="fk">${esc(g)}</div>
        <div class="fv" style="font-size:.85rem">${items.map(s => esc(s.name)).join(' · ')}</div></div>`).join('')}</div>`;
  } else if (id === 'experience') {
    body = `${osHeader('EXPÉRIENCE')}<div class="os-list">
      ${xp.map(e => `<div class="os-row"><span class="r1">${esc(e.title)} <span class="os-chip">${esc(e.type)}</span></span>
        <span class="r2">${esc(e.year)}</span></div>`).join('')}</div>`;
  } else if (id === 'galerie') {
    body = `${osHeader('GALERIE')}<div class="os-list">
      <a class="os-row" href="demon-realm.html"><span class="r1">Demon Realm</span><span class="r2">Captures du jeu →</span></a>
      <a class="os-row" href="asso-manager.html"><span class="r1">AssoManager</span><span class="r2">Interfaces →</span></a></div>`;
  } else if (id === 'contact') {
    const row = (k, v, href) => href
      ? `<a class="os-row" href="${esc(href)}" ${href.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}><span class="r1">${esc(k)}</span><span class="r2">${esc(v)}</span></a>`
      : `<div class="os-row"><span class="r1">${esc(k)}</span><span class="r2">${esc(v)}</span></div>`;
    body = `${osHeader('CONTACT')}<div class="os-list">
      ${contact.email ? row('Email', contact.email, 'mailto:' + contact.email) : ''}
      ${contact.github ? row('GitHub', 'github.com/Shok75', contact.github) : ''}
      ${contact.linkedin ? row('LinkedIn', 'Voir le profil', contact.linkedin) : row('LinkedIn', 'À ajouter')}
      ${contact.cv ? row('CV', 'Télécharger', contact.cv) : row('CV', 'À ajouter')}</div>`;
  }
  screen.innerHTML = `<div class="os-view">${body}</div>`;
}
function openPhone() { phone?.classList.remove('hidden'); }
function closePhone() { phone?.classList.add('hidden'); }
if (screen) {
  osHome();
  screen.addEventListener('click', e => {
    const app = e.target.closest('[data-app]');
    if (app) { osApp(app.dataset.app); return; }
    if (e.target.closest('[data-close-phone]')) closePhone();
  });
  $('#phoneHomeBtn')?.addEventListener('click', osHome);
  $('#phoneClose')?.addEventListener('click', closePhone);
  $('#fabPhone')?.addEventListener('click', () => { openPhone(); if (window.innerWidth <= 768) osHome(); });
  $('#openPhoneMobile')?.addEventListener('click', () => { openPhone(); osHome(); });
  // Sur mobile, le téléphone démarre fermé
  if (window.innerWidth <= 768) closePhone();
}

/* ------------------------------------------------------------------ *
 * Notifications (frontend, décoratif)
 * ------------------------------------------------------------------ */
const NOTIFS = [
  { i: '🎮', t: 'Nouveau projet disponible', d: 'Demon Realm', c: '' },
  { i: '🎯', t: 'Recherche de stage', d: 'Disponible actuellement !', c: 'ok' },
  { i: '⚡', t: 'Nouvelle compétence', d: 'PostgreSQL', c: 'warn' }
];
function pushNotif(n) {
  const stack = $('#notifStack');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = `notif ${n.c}`;
  el.style.pointerEvents = 'auto';
  el.innerHTML = `<span class="ni">${n.i}</span><div><div class="nt">${esc(n.t)}</div><div class="nd">${esc(n.d)}</div></div>`;
  stack.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 500); }, 5200);
}
if (!RM) {
  NOTIFS.forEach((n, i) => setTimeout(() => pushNotif(n), 2200 + i * 2600));
}

/* ------------------------------------------------------------------ *
 * Révélation au scroll
 * ------------------------------------------------------------------ */
function initReveal() {
  if (RM || !('IntersectionObserver' in window)) return;
  const targets = $$('.mission, .hud-card, .skill-group, .tl-item, .contact-box, .about-text');
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visible'); o.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(t => { t.classList.add('reveal'); obs.observe(t); });
}

/* ------------------------------------------------------------------ *
 * Init
 * ------------------------------------------------------------------ */
renderMissions();
renderSkills();
renderTimeline();
renderContact();
initReveal();

/* ------------------------------------------------------------------ *
 * Lightbox (pages projet : galeries d'images)
 * ------------------------------------------------------------------ */
(function initLightbox() {
  const images = $$('.gallery-item img');
  if (!images.length) return;
  let idx = 0, lastFocus = null;
  const ov = document.createElement('div');
  ov.className = 'lightbox';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-hidden', 'true');
  ov.innerHTML = `<button class="lightbox-close" aria-label="Fermer">&times;</button>
    <button class="lightbox-nav lightbox-prev" aria-label="Précédente">&#8249;</button>
    <figure class="lightbox-figure"><img class="lightbox-img" alt=""><figcaption class="lightbox-caption"></figcaption></figure>
    <button class="lightbox-nav lightbox-next" aria-label="Suivante">&#8250;</button>
    <div class="lightbox-counter"></div>`;
  document.body.appendChild(ov);
  const img = $('.lightbox-img', ov), cap = $('.lightbox-caption', ov), cnt = $('.lightbox-counter', ov);
  const render = () => {
    const s = images[idx];
    img.src = s.currentSrc || s.src; img.alt = s.alt || '';
    cap.textContent = s.closest('.gallery-item')?.querySelector('p')?.textContent || s.alt || '';
    cnt.textContent = `${idx + 1} / ${images.length}`;
    img.classList.remove('zoom-in'); void img.offsetWidth; img.classList.add('zoom-in');
  };
  const open = i => { idx = i; lastFocus = document.activeElement; render(); ov.classList.add('open'); ov.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; $('.lightbox-close', ov).focus(); };
  const close = () => { ov.classList.remove('open'); ov.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; lastFocus?.focus?.(); };
  const show = d => { idx = (idx + d + images.length) % images.length; render(); };
  images.forEach((im, i) => {
    im.classList.add('zoomable'); im.tabIndex = 0; im.setAttribute('role', 'button');
    im.setAttribute('aria-label', `Agrandir : ${im.alt || 'image ' + (i + 1)}`);
    im.addEventListener('click', () => open(i));
    im.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
  });
  $('.lightbox-close', ov).addEventListener('click', close);
  $('.lightbox-prev', ov).addEventListener('click', () => show(-1));
  $('.lightbox-next', ov).addEventListener('click', () => show(1));
  ov.addEventListener('click', e => { if (e.target === ov || e.target.classList.contains('lightbox-figure')) close(); });
  if (images.length < 2) { $('.lightbox-prev', ov).style.display = 'none'; $('.lightbox-next', ov).style.display = 'none'; }
  document.addEventListener('keydown', e => {
    if (!ov.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(-1);
    else if (e.key === 'ArrowRight') show(1);
  });
})();
