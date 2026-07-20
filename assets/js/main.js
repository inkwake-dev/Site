/* ==========================================================================
   INKWAKE — main.js
   Scroll reveals, ink-divider draw-in, FAQ accordion, portfolio filter +
   load more, skill bar fill, animated counters, contact/apply form
   validation, and phone number formatting. Vanilla JS, no build step.
   ========================================================================== */

/* ---------- Generic scroll reveal ---------- */
function inkwakeInitReveal(){
  const targets = document.querySelectorAll('.reveal, .ink-divider, .footer-links.reveal-list');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  targets.forEach(t => io.observe(t));
}

/* ---------- Skill bars (About page) ---------- */
function inkwakeInitSkillBars(){
  const bars = document.querySelectorAll('.skill-fill');
  if(!bars.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const target = entry.target.getAttribute('data-fill') || '0%';
        entry.target.style.width = target;
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => io.observe(b));
}

/* ---------- Animated counters (hero stats) ---------- */
function inkwakeInitCounters(){
  const counters = document.querySelectorAll('[data-count]');
  if(!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1200;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * end) + suffix;
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => io.observe(c));
}

/* ---------- FAQ accordion ---------- */
function inkwakeInitFaq(){
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    if(!btn || !ans) return;
    btn.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      document.querySelectorAll('.faq-item').forEach(other => {
        other.setAttribute('data-open','false');
        other.querySelector('.faq-a').style.maxHeight = null;
        other.querySelector('.faq-q').setAttribute('aria-expanded','false');
      });
      if(!isOpen){
        item.setAttribute('data-open','true');
        ans.style.maxHeight = ans.scrollHeight + 'px';
        btn.setAttribute('aria-expanded','true');
      }
    });
  });
}

/* ---------- Portfolio filter + load more ---------- */
function inkwakeInitPortfolio(){
  const grid = document.querySelector('[data-project-grid]');
  if(!grid) return;
  const cards = Array.from(grid.querySelectorAll('.project-card'));
  const filterBtns = document.querySelectorAll('.filter-btn');
  const loadMoreBtn = document.querySelector('[data-load-more]');
  const pageSize = 6;
  let activeFilter = 'all';
  let visibleCount = pageSize;

  function render(){
    const filtered = cards.filter(c => activeFilter === 'all' || c.getAttribute('data-category') === activeFilter);
    filtered.forEach((c, i) => { c.style.display = i < visibleCount ? '' : 'none'; });
    cards.filter(c => !filtered.includes(c)).forEach(c => c.style.display = 'none');
    if(loadMoreBtn) loadMoreBtn.style.display = filtered.length > visibleCount ? 'inline-flex' : 'none';
  }

  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.getAttribute('data-filter');
    visibleCount = pageSize;
    render();
  }));

  if(loadMoreBtn) loadMoreBtn.addEventListener('click', () => { visibleCount += pageSize; render(); });

  render();
}

/* ---------- Real-time form validation ---------- */
function inkwakeValidateField(field){
  const input = field.querySelector('input, select, textarea');
  const errorEl = field.querySelector('.error-msg');
  if(!input) return true;
  let message = '';

  if(input.hasAttribute('required') && !input.value.trim()){
    message = 'This field is required.';
  } else if(input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)){
    message = 'Enter a valid email address.';
  } else if(input.type === 'tel' && input.value && !/^[0-9+\-\s()]{7,15}$/.test(input.value)){
    message = 'Enter a valid phone number.';
  }

  field.classList.toggle('invalid', !!message);
  if(errorEl) errorEl.textContent = message;
  return !message;
}

/* ---------- Multi-Service Form Submissions (Web3Forms & Forminit) ---------- */
function inkwakeInitForm(formSelector, successSelector, service = 'web3forms'){
  const form = document.querySelector(formSelector);
  if(!form) return;
  const success = document.querySelector(successSelector);
  const submitBtn = form.querySelector('button[type="submit"]');

  // Attach validation listeners
  form.querySelectorAll('.field').forEach(field => {
    const input = field.querySelector('input, select, textarea');
    if(!input) return;
    input.addEventListener('blur', () => inkwakeValidateField(field));
    input.addEventListener('input', () => { if(field.classList.contains('invalid')) inkwakeValidateField(field); });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    
    // Check all fields
    form.querySelectorAll('.field').forEach(field => { if(!inkwakeValidateField(field)) valid = false; });

    // Required checkboxes outside .field wrappers
    form.querySelectorAll('.field-checkbox input[type="checkbox"][required]').forEach(cb => {
      const wrap = cb.closest('.field-checkbox');
      if(!cb.checked){
        valid = false;
        wrap.style.outline = '1px solid #ff8080';
        wrap.style.borderRadius = '8px';
      } else {
        wrap.style.outline = '';
      }
    });

    if(!valid){
      form.querySelector('.invalid input, .invalid select, .invalid textarea')?.focus();
      return;
    }

    const formData = new FormData(form);
    let fetchUrl = '';

    // Route logic based on the requested service
    if (service === 'web3forms') {
      const key = typeof web3formsAccessKey !== 'undefined' ? web3formsAccessKey : '';
      if(!key || key === 'YOUR_WEB3FORMS_ACCESS_KEY'){
        console.warn('Inkwake: web3formsAccessKey is not set. Submission aborted.');
        if(success){ success.classList.add('show'); form.reset(); }
        return;
      }
      formData.append('access_key', key);
      fetchUrl = 'https://api.web3forms.com/submit';
    } else if (service === 'forminit') {
      // Pulls the unique endpoint directly from your career.html form action
      fetchUrl = form.getAttribute('action'); 
      if(!fetchUrl) {
        console.error('Inkwake: Forminit requires an action URL on the form element.');
        return;
      }
    }

    if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

    try{
      const res = await fetch(fetchUrl, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }, 
        body: formData
      });
      
      if(res.ok){
        // res.ok is reliable for Forminit. We parse JSON just to double check Web3Forms specific false-successes.
        const result = await res.json().catch(() => ({})); 
        if (service === 'web3forms' && result.success === false) {
           throw new Error(result.message || 'Web3Forms rejected submission');
        }
        if(success){ success.classList.add('show'); form.reset(); }
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Submission failed');
      }
    } catch(err){
      console.error('Inkwake: form submission failed', err);
      alert("Something went wrong processing your request. Please ensure files are within size limits and try again.");
    } finally {
      if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = submitBtn.getAttribute('data-label') || 'Submit'; }
    }
  });
}

/* ---------- Scrollspy: highlight the current section in the nav ---------- */
function inkwakeInitScrollspy(){
  const sections = document.querySelectorAll('main [id]');
  const links = document.querySelectorAll('.nav-links a[data-section], .drawer a[data-section]');
  if(!sections.length || !links.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      links.forEach(l => l.removeAttribute('aria-current'));
      const match = document.querySelector(`.nav-links a[data-section="${entry.target.id}"]`);
      if(match) match.setAttribute('aria-current','section');
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => io.observe(s));
}

/* ---------- Parallax: background layers drift horizontally on scroll ---------- */
function inkwakeInitParallax(){
  const layers = document.querySelectorAll('.parallax-layer');
  if(!layers.length) return;
  let ticking = false;

  function update(){
    const y = window.scrollY;
    layers.forEach(layer => {
      const speed = parseFloat(layer.getAttribute('data-speed')) || 0.08;
      const dir = layer.getAttribute('data-dir') === 'left' ? -1 : 1;
      const offset = Math.min(y * speed * dir, 260);
      layer.style.transform = `translateX(${offset}px)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ---------- Testimonials carousel ---------- */
function inkwakeInitTestimonials(){
  const track = document.querySelector('[data-testimonial-track]');
  if(!track) return;
  const slides = Array.from(track.children);
  const dotsWrap = document.querySelector('[data-testimonial-dots]');
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if(i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap?.appendChild(dot);
  });

  function goTo(i){
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dotsWrap?.querySelectorAll('button').forEach((d, di) => d.classList.toggle('active', di === index));
  }

  let auto = setInterval(() => goTo(index + 1), 6000);
  track.closest('.testimonial-track-wrap')?.addEventListener('mouseenter', () => clearInterval(auto));
}

/* ---------- Careers application modal ---------- */
function inkwakeInitModal(){
  const backdrop = document.querySelector('[data-modal-backdrop]');
  if(!backdrop) return;
  const roleField = document.getElementById('a-role');

  function open(role){
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if(role && roleField) roleField.value = role;
  }
  function close(){
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-apply-role]').forEach(btn => {
    btn.addEventListener('click', () => open(btn.getAttribute('data-apply-role')));
  });
  backdrop.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', close));
  backdrop.addEventListener('click', (e) => { if(e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') close(); });
}

/* ---------- Terms / Privacy standalone accept checkbox ---------- */
function inkwakeInitAcceptBlock(){
  const block = document.querySelector('[data-accept-block]');
  if(!block) return;
  const KEY = block.getAttribute('data-accept-key') || 'inkwake_accept';
  const checkbox = block.querySelector('input[type="checkbox"]');
  const status = block.querySelector('.accept-status');

  if(localStorage.getItem(KEY) === 'accepted' && checkbox){
    checkbox.checked = true;
    status?.classList.add('show');
  }

  checkbox?.addEventListener('change', () => {
    if(checkbox.checked){
      localStorage.setItem(KEY, 'accepted');
      status?.classList.add('show');
    } else {
      localStorage.removeItem(KEY);
      status?.classList.remove('show');
    }
  });
}
function inkwakeInitCookieConsent(){
  const banner = document.querySelector('[data-cookie-banner]');
  if(!banner) return;
  const KEY = 'inkwake_cookie_consent';

  if(!localStorage.getItem(KEY)){
    setTimeout(() => banner.classList.add('show'), 900);
  }
  banner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
    localStorage.setItem(KEY, 'accepted');
    banner.classList.remove('show');
  });
  banner.querySelector('[data-cookie-decline]')?.addEventListener('click', () => {
    localStorage.setItem(KEY, 'declined');
    banner.classList.remove('show');
  });
}

/* ---------- Phone Number Formatting (E.164 Enforcer) ---------- */
function inkwakeInitPhoneFormatting(){
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  
  phoneInputs.forEach(input => {
    // Pre-fill with +91 if it's completely empty when clicked
    input.addEventListener('focus', function() {
      if (this.value === '') {
        this.value = '+91';
      }
    });

    // Prevent the user from deleting the '+' sign
    input.addEventListener('input', function() {
      if (this.value !== '' && !this.value.startsWith('+')) {
        // If they deleted the +, put it back and strip any weird characters
        this.value = '+' + this.value.replace(/[^0-9]/g, '');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    inkwakeInitReveal();
  }, 60);

  inkwakeInitSkillBars();
  inkwakeInitCounters();
  inkwakeInitFaq();
  inkwakeInitPortfolio();
  
  // Initialize the new phone formatting feature
  inkwakeInitPhoneFormatting();
  
  // Here is where the magic happens! We pass the specific service for each form.
  inkwakeInitForm('#contact-form', '#contact-success', 'web3forms');
  
  // Keep this commented out so Forminit file uploads work natively via the browser!
  inkwakeInitForm('#apply-form', '#apply-success', 'forminit');
  
  inkwakeInitScrollspy();
  inkwakeInitParallax();
  inkwakeInitTestimonials();
  inkwakeInitCookieConsent();
  inkwakeInitModal();
  inkwakeInitAcceptBlock();
});
