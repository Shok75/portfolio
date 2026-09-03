// Le contenu est visible par défaut ; on ne fait de l'"amélioration progressive"
// que si JS tourne. On marque donc <html> tout de suite.
document.documentElement.classList.add('js');

/* ------------------------------------------------------------------ *
 * 1. Menu mobile (burger)
 * ------------------------------------------------------------------ */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

function closeMenu() {
    if (!navLinks || !burger) return;
    navLinks.classList.remove('active');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
}

if (burger && navLinks) {
    burger.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        burger.classList.toggle('active', open);
        burger.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('menu-open', open);
    });

    // Fermer le menu au clic sur un lien
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fermer avec Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

/* ------------------------------------------------------------------ *
 * 2. Ombre de la navbar au scroll (via classe, throttlé rAF)
 * ------------------------------------------------------------------ */
const navbar = document.querySelector('.navbar');
let scrollScheduled = false;

function onScroll() {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    scrollScheduled = false;
}

window.addEventListener('scroll', () => {
    if (!scrollScheduled) {
        scrollScheduled = true;
        window.requestAnimationFrame(onScroll);
    }
}, { passive: true });
onScroll();

/* ------------------------------------------------------------------ *
 * 3. Scroll-spy : lien de nav actif via IntersectionObserver
 *    (remplace la lecture d'offsetTop à chaque frame de scroll)
 * ------------------------------------------------------------------ */
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

if (sections.length && navLinksAll.length && 'IntersectionObserver' in window) {
    const setActive = (id) => {
        navLinksAll.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
    };

    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActive(entry.target.id);
        });
    }, {
        // La section est "active" quand elle occupe la bande centrale de l'écran.
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0
    });

    sections.forEach(section => spy.observe(section));
}

/* ------------------------------------------------------------------ *
 * 4. Révélation au scroll — sécurisée : n'agit que si le mouvement
 *    est autorisé, et ne cache jamais le contenu de façon permanente.
 * ------------------------------------------------------------------ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = document.querySelectorAll(
    '.project-card, .stat-box, .skill-group, .feature-item, .tech-card, .gallery-item, .challenge-item, .role-card'
);

if (!prefersReducedMotion && 'IntersectionObserver' in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
}

/* ------------------------------------------------------------------ *
 * 5. Lightbox pour les galeries d'images
 * ------------------------------------------------------------------ */
(function initLightbox() {
    const images = Array.from(document.querySelectorAll('.gallery-item img'));
    if (!images.length) return;

    let currentIndex = 0;
    let lastFocused = null;

    // Construction de l'overlay
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Aperçu de l\'image');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
        <button class="lightbox-close" aria-label="Fermer">&times;</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Image précédente">&#8249;</button>
        <figure class="lightbox-figure">
            <img class="lightbox-img" alt="">
            <figcaption class="lightbox-caption"></figcaption>
        </figure>
        <button class="lightbox-nav lightbox-next" aria-label="Image suivante">&#8250;</button>
        <div class="lightbox-counter" aria-hidden="true"></div>
    `;
    document.body.appendChild(overlay);

    const imgEl = overlay.querySelector('.lightbox-img');
    const captionEl = overlay.querySelector('.lightbox-caption');
    const counterEl = overlay.querySelector('.lightbox-counter');
    const btnClose = overlay.querySelector('.lightbox-close');
    const btnPrev = overlay.querySelector('.lightbox-prev');
    const btnNext = overlay.querySelector('.lightbox-next');

    function render() {
        const source = images[currentIndex];
        imgEl.src = source.currentSrc || source.src;
        imgEl.alt = source.alt || '';
        const caption = source.closest('.gallery-item')?.querySelector('p')?.textContent
            || source.alt || '';
        captionEl.textContent = caption;
        counterEl.textContent = `${currentIndex + 1} / ${images.length}`;
        // Retrigger de l'animation de zoom
        imgEl.classList.remove('zoom-in');
        void imgEl.offsetWidth;
        imgEl.classList.add('zoom-in');
    }

    function open(index) {
        currentIndex = index;
        lastFocused = document.activeElement;
        render();
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
        btnClose.focus();
    }

    function close() {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    const show = (dir) => {
        currentIndex = (currentIndex + dir + images.length) % images.length;
        render();
    };

    images.forEach((img, i) => {
        img.classList.add('zoomable');
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', `Agrandir : ${img.alt || 'image ' + (i + 1)}`);
        img.addEventListener('click', () => open(i));
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open(i);
            }
        });
    });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', () => show(-1));
    btnNext.addEventListener('click', () => show(1));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('lightbox-figure')) close();
    });

    // N'affiche les flèches que s'il y a plusieurs images
    if (images.length < 2) {
        btnPrev.style.display = 'none';
        btnNext.style.display = 'none';
    }

    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(-1);
        else if (e.key === 'ArrowRight') show(1);
        else if (e.key === 'Tab') {
            // Piège à focus simple : garde le focus dans la lightbox
            const focusables = overlay.querySelectorAll('button');
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        }
    });
})();
