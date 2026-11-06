/* =====================================================================
   js/main.js  —  ONE shared script for every page (except welcome.html).
   Put this at the very end of <body>, right before </body>:
     <script src="js/main.js"></script>
   It replaces ALL the small <script> blocks that were copied into each
   page. Every part checks that its element exists, so it is safe on any page.
   ===================================================================== */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Item 51 · sessionStorage can throw (private mode, blocked storage) ---- */
  function storeGet(key) {
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function storeRemove(key) {
    try { sessionStorage.removeItem(key); } catch (e) { /* ignore */ }
  }

  /* ---- Items 35 + 55 · mobile menu ------------------------------------------ */
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (toggle && links) {
    const setOpen = (open) => {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
    links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ---- Item 35 · mark the current page in the menu ---------------------------
     Works with "about.html" and with clean URLs like "/about". */
  const clean = (s) => (s || '').replace(/\.html$/, '');
  const here  = clean(location.pathname.split('/').pop()) || 'index';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    if (clean(a.getAttribute('href')) === here) a.setAttribute('aria-current', 'page');
  });

  /* ---- Click-to-reveal cards: books, films, travel stamps (Items 26, 27) ----- */
  document.querySelectorAll('.card-toggle').forEach((btn) => {
    const card = btn.parentElement;
    btn.addEventListener('click', () => {
      const open = card.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---- Cassette: spin the reels (the link itself opens Spotify) (Item 53) ---- */
  const cassette = document.getElementById('cassette');
  if (cassette) {
    cassette.addEventListener('click', () => {
      cassette.querySelectorAll('.reel').forEach((reel) => {
        reel.style.transition = 'transform 1.4s ease';
        reel.style.transform = 'rotate(900deg)';
        setTimeout(() => {
          reel.style.transition = 'none';
          reel.style.transform = 'rotate(0deg)';
        }, 1450);
      });
    });
  }

  /* ---- Sparkle trail (Items 36, 55) · skipped for reduced motion ------------- */
  const SPARKLES = ['✦', '✧', '★', '☆', '✿'];
  const COLORS   = ['#f4b8d0', '#c9b6e4', '#a8d0e6', '#f7e6a8'];
  document.addEventListener('mousemove', (e) => {
    if (reduceMotion.matches || Math.random() < 0.85) return;
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.setAttribute('aria-hidden', 'true');
    s.textContent = SPARKLES[Math.floor(Math.random() * SPARKLES.length)];
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    s.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
  });

  /* ---- Item 43 · endless film strip, wide enough for any screen -------------
     The HTML only needs each photo ONCE. This script repeats them until the
     strip is wider than the screen, then copies the whole row once more so the
     "-50%" animation in style.css loops without a gap. */
  const strip = document.querySelector('.film-strip');
  if (strip && strip.children.length) {
    const originals = Array.from(strip.children);
    const makeClone = (node) => {
      const c = node.cloneNode(true);
      c.setAttribute('data-clone', '');
      c.setAttribute('aria-hidden', 'true');
      return c;
    };
    const build = () => {
      strip.querySelectorAll('[data-clone]').forEach((n) => n.remove());
      let guard = 0;
      while (strip.scrollWidth < window.innerWidth && guard++ < 20) {
        originals.forEach((n) => strip.appendChild(makeClone(n)));
      }
      Array.from(strip.children).forEach((n) => strip.appendChild(makeClone(n)));
    };
    build();
    let timer;
    window.addEventListener('resize', () => {
      clearTimeout(timer);
      timer = setTimeout(build, 250);
    });
  }

  /* ---- Items 48, 50 · welcome banner on the home page -----------------------
     Shows ONCE after the visitor typed a name on welcome.html.
     textContent (not innerHTML) so a name like <b>x</b> can never run as code. */
  if (document.body.dataset.page === 'home') {
    const name = storeGet('visitorName');
    if (name && storeGet('justEntered') === 'yes') {
      storeRemove('justEntered');
      const banner = document.createElement('div');
      banner.className = 'welcome-banner';
      banner.setAttribute('role', 'status');
      banner.textContent = 'hi ' + name + '! come wander ♡';
      document.body.appendChild(banner);
      setTimeout(() => banner.classList.add('show'), 100);
      setTimeout(() => {
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 600);
      }, 3600);
    }
  }

  /* ---- Item 13 · the "press m" secret ---------------------------------------
     style.css already has #secret and #secret.show. Change the message below. */
  const footer = document.querySelector('footer');
  if (footer) {
    const secret = document.createElement('p');
    secret.id = 'secret';
    secret.setAttribute('role', 'status');
    secret.textContent = 'you found the secret ✦ thank you for reading all the way down.'; // <- REPLACE with your own message
    footer.appendChild(secret);

    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() !== 'm' || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      // do not trigger while typing in the terminal or the name field
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      secret.classList.toggle('show');
    });
  }
})();
