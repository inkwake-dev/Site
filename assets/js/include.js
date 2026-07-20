/* ==========================================================================
   INKWAKE — Site config
   Edit the values below once; every page (nav, footer, WhatsApp button,
   contact links) reads from here. No need to hunt through individual pages.
   ========================================================================== */
window.INKWAKE_CONFIG = {
  // Real WhatsApp number provided — international format for wa.me links.
  // Assumed +91 (India) since the number was given without a country code;
  // change the "91" prefix in whatsappNumber below if that's wrong.
  whatsappNumber: "918546842549",
  whatsappMessage: "Hi Inkwake, I'd like to talk about a project.",

  telegram: "https://t.me/Inkwakee",
  linkedin: "https://www.linkedin.com/company/inkwake",
  instagram: "https://www.instagram.com/inkwake_",
  email: "inkwake2025@gmail.com",
  founderEmail: "inkwake@gmail.com",

  // TODO: sign up free at https://web3forms.com, verify this email, and
  // paste your Access Key here. Both the Contact and Apply forms use it —
  // no backend required, submissions land straight in your inbox (resume
  // PDFs included, up to the free-tier size limit).
  web3formsAccessKey: "1c0a9213-c2cb-4183-b685-5d24eb3e6835",

  siteName: "Inkwake",
  tagline: "Built with passion, delivered with purpose."
};

function inkwakeWireLinks(root = document){
  const cfg = window.INKWAKE_CONFIG;
  const waHref = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(cfg.whatsappMessage)}`;
  root.querySelectorAll('[data-link="whatsapp"]').forEach(el => el.href = waHref);
  root.querySelectorAll('[data-link="telegram"]').forEach(el => el.href = cfg.telegram);
  root.querySelectorAll('[data-link="linkedin"]').forEach(el => el.href = cfg.linkedin);
  root.querySelectorAll('[data-link="instagram"]').forEach(el => el.href = cfg.instagram);
  root.querySelectorAll('[data-link="email"]').forEach(el => el.href = `mailto:${cfg.email}`);
  root.querySelectorAll('[data-text="email"]').forEach(el => el.textContent = cfg.email);
}

/* ---- Page init ----
   The header and footer used to be loaded at runtime via fetch(); they are
   now inlined directly into every page's HTML so the site works by simply
   double-clicking a file open (no local server or fetch() required, which
   browsers block on file:// URLs). This just wires up links, nav-highlight,
   the mobile drawer, and the page-load transition against that already-
   present markup. */
function inkwakeInitPage(){
  // Mark current nav link active
  const page = document.body.getAttribute('data-page');
  if(page){
    document.querySelectorAll(`.nav-links a, .drawer a`).forEach(a => {
      if(a.getAttribute('data-page') === page) a.setAttribute('aria-current','page');
    });
  }

  inkwakeWireLinks();
  inkwakeInitNav();

  // Page-load transition: content slides/fades in left → right
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.body.classList.add('page-loaded'));
  });
}

function inkwakeInitNav(){
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  if(!toggle || !drawer || !backdrop) return;

  function closeDrawer(){
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
  }
  function openDrawer(){
    drawer.classList.add('open');
    backdrop.classList.add('open');
    toggle.setAttribute('aria-expanded','true');
  }
  toggle.addEventListener('click', () => {
    toggle.getAttribute('aria-expanded') === 'true' ? closeDrawer() : openDrawer();
  });
  backdrop.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeDrawer(); });
}

document.addEventListener('DOMContentLoaded', inkwakeInitPage);
