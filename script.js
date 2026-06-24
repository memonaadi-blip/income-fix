/* ===== Year ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== Nav scroll state ===== */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ===== Mobile menu ===== */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.classList.remove('open');
}));

/* ===== Scrollspy: highlight active nav link ===== */
const navAnchors = [...navLinks.querySelectorAll('a')];
const spyTargets = navAnchors
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);
const spy = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const id = en.target.id;
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
spyTargets.forEach(t => spy.observe(t));

/* ===== Staggered reveal for card grids ===== */
document.querySelectorAll('.cards, .tcards, .stats').forEach(group => {
  [...group.querySelectorAll('[data-reveal]')].forEach((el, i) => {
    el.style.setProperty('--reveal-delay', (i * 90) + 'ms');
  });
});

/* ===== Cursor glow follow ===== */
const glow = document.getElementById('cursorGlow');
let gx = window.innerWidth / 2, gy = window.innerHeight * 0.3, cx = gx, cy = gy;
window.addEventListener('mousemove', e => { gx = e.clientX; gy = e.clientY; });
(function glowLoop(){
  cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
  glow.style.left = cx + 'px'; glow.style.top = cy + 'px';
  requestAnimationFrame(glowLoop);
})();

/* ===== Reveal on scroll + count-up trigger ===== */
const counted = new WeakSet();
const reveal = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    // count-up numbers inside
    en.target.querySelectorAll('[data-count]').forEach(el => { if (!counted.has(el)) { counted.add(el); countUp(el); } });
    // ring animation
    en.target.querySelectorAll('.ring-progress').forEach(r => r.classList.add('go'));
    reveal.unobserve(en.target);
  });
}, { threshold: 0.18 });
document.querySelectorAll('[data-reveal]').forEach(el => reveal.observe(el));

/* ===== Count-up ===== */
function countUp(el){
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = (el.dataset.count.split('.')[1] || '').length;
  const dur = 1600; const start = performance.now();
  function tick(now){
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = (target * eased).toFixed(decimals);
    el.textContent = prefix + val + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ===== Timeline progress fill ===== */
const tFill = document.getElementById('tLineFill');
const timeline = document.querySelector('.timeline');
if (tFill && timeline){
  const onTl = () => {
    const r = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = r.height;
    const progressed = Math.min(Math.max(vh * 0.6 - r.top, 0), total);
    tFill.style.height = progressed + 'px';
  };
  onTl();
  window.addEventListener('scroll', onTl, { passive: true });
}

/* ===== Service card spotlight ===== */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

/* ===== Service detail modal ===== */
const SERVICES = {
  'Investment Advisory': {
    eyebrow: 'Grow your money',
    formValue: 'Investment Advisory',
    lede: 'A globally diversified, risk-aware portfolio engineered to compound your wealth — built around your goals, timeline and tolerance, then continuously rebalanced as markets move.',
    includes: ['Personalized risk & goal assessment', 'Low-cost diversified portfolio design', 'Automatic rebalancing & tax-loss harvesting', 'Quarterly performance reviews', 'Direct access to your advisor'],
    for: 'Anyone with savings to invest who wants professional, conflict-free guidance instead of guessing — from first-time investors to those managing a sizeable portfolio.',
    pricing: 'From <b>0.6%</b> of assets / year'
  },
  'Tax Planning': {
    eyebrow: 'Keep more of it',
    formValue: 'Tax Planning',
    lede: 'Proactive, year-round tax strategy — not a once-a-year scramble. We legally minimize what you owe so more of every dollar you earn stays with you.',
    includes: ['Year-round tax-saving strategy', 'Deduction & credit optimization', 'Entity & income structuring', 'Estimated-payment planning', 'Coordination with your CPA at filing'],
    for: 'High earners, business owners, freelancers and anyone with a complex or growing income who feels they pay more tax than they should.',
    pricing: 'From <b>$1,200</b> / year'
  },
  'Wealth Protection': {
    eyebrow: 'Stay secure',
    formValue: 'Wealth Protection',
    lede: 'Insurance, estate and risk planning that shields your family and assets from the unexpected — so a single event can never undo years of progress.',
    includes: ['Life, disability & liability review', 'Estate & beneficiary planning', 'Asset-protection structuring', 'Emergency-fund strategy', 'Annual coverage health-check'],
    for: 'Families, homeowners and business owners who want certainty that their loved ones and assets are protected no matter what happens.',
    pricing: 'Flat <b>$900</b> review'
  },
  'Retirement Planning': {
    eyebrow: 'Plan your freedom',
    formValue: 'Retirement Planning',
    lede: 'A clear, numbers-backed roadmap to financial independence — with projections you can actually trust, stress-test and adjust as life changes.',
    includes: ['Retirement-income projections', 'Account strategy (401k, IRA, Roth)', 'Withdrawal & drawdown planning', 'Social Security optimization', 'Scenario & "what-if" modeling'],
    for: 'Anyone 5–30 years from retirement who wants to know — with confidence — exactly when and how they can stop working.',
    pricing: 'From <b>$1,500</b> plan'
  },
  'Cash Flow & Budgeting': {
    eyebrow: 'Master your money',
    formValue: 'Cash Flow & Budgeting',
    lede: 'Real-time visibility into where your money goes, plus smart automation that pays you first — turning irregular income into a calm, predictable system.',
    includes: ['Unified cash-flow dashboard', 'Automated "pay yourself first" rules', 'Spending & savings targets', 'Irregular-income smoothing', 'Monthly check-ins'],
    for: 'Freelancers, dual-income households and anyone whose money feels chaotic and wants a simple system that runs itself.',
    pricing: 'From <b>$120</b> / month'
  },
  'Business Finance': {
    eyebrow: 'Scale with clarity',
    formValue: 'Business Finance',
    lede: 'From entity structuring to forecasting, we give your company the financial clarity it needs to make confident decisions and scale sustainably.',
    includes: ['Entity & compensation structuring', 'Cash-flow & runway forecasting', 'Profit & pricing analysis', 'Owner pay & tax coordination', 'Quarterly strategy sessions'],
    for: 'Founders, agencies and small-business owners who want a financial co-pilot rather than just a bookkeeper.',
    pricing: 'Custom — from <b>$500</b> / month'
  }
};

const modal = document.getElementById('serviceModal');
const modalEls = {
  icon: document.getElementById('modalIcon'),
  eyebrow: document.getElementById('modalEyebrow'),
  title: document.getElementById('modalTitle'),
  lede: document.getElementById('modalLede'),
  includes: document.getElementById('modalIncludes'),
  for: document.getElementById('modalFor'),
  pricing: document.getElementById('modalPricing'),
  consult: document.getElementById('modalConsult'),
  close: document.getElementById('modalClose')
};
let lastFocused = null;
let activeService = null;

function openModal(card){
  const title = card.querySelector('h3').textContent.trim();
  const data = SERVICES[title];
  if (!data) return;
  activeService = data.formValue;
  lastFocused = card;
  modalEls.icon.innerHTML = card.querySelector('.svc-icon').innerHTML;
  modalEls.eyebrow.textContent = data.eyebrow;
  modalEls.title.textContent = title;
  modalEls.lede.textContent = data.lede;
  modalEls.includes.innerHTML = data.includes.map(i => `<li>${i}</li>`).join('');
  modalEls.for.textContent = data.for;
  modalEls.pricing.innerHTML = data.pricing;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalEls.close.focus();
}
function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

// Make each service card interactive + accessible
document.querySelectorAll('.service-card').forEach(card => {
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-haspopup', 'dialog');
  card.addEventListener('click', () => openModal(card));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
  });
});

modalEls.close.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

// "Connect with a consultant" → open Calendly popup for this service (Calendly collects name/email)
modalEls.consult.addEventListener('click', () => {
  const service = activeService || 'General';
  const opened = openCalendly({ service });
  closeModal();
  if (!opened){
    // Fallback: scroll to the inline scheduler in the contact section
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  }
});

/* ===== Calendly scheduling =====
   1. Create a free account at https://calendly.com (sign up with memon.aadi@gmail.com)
   2. Create an event type (e.g. "Free 30-min Strategy Call") and connect Google Meet / Zoom
      so a join link is auto-generated for every booking.
   3. Copy your event link and paste it below, e.g. https://calendly.com/memon-aadi/30min
   When a client books, Calendly emails YOU at memon.aadi@gmail.com AND sends the client
   a calendar invite with the meeting link. */
const CALENDLY_URL = 'https://calendly.com/memon-aadi/30min'; // your live Calendly event link

// Theme the Calendly UI to match the site (dark bg, brand accent)
function themedCalendlyUrl(){
  const sep = CALENDLY_URL.includes('?') ? '&' : '?';
  return CALENDLY_URL + sep + 'background_color=0d1322&text_color=eef2fa&primary_color=38bdf8&hide_gdpr_banner=1';
}

// Popup scheduler (used by service-modal "Connect with a consultant")
function openCalendly(prefill){
  prefill = prefill || {};
  if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function'){
    window.Calendly.initPopupWidget({
      url: themedCalendlyUrl(),
      prefill: { name: prefill.name || '', email: prefill.email || '' },
      utm: { utmContent: prefill.service || 'General' }
    });
    return true;
  }
  return false; // Calendly not loaded (offline / blocked)
}

/* ===== Inline Calendly scheduler in the contact section ===== */
(function inlineScheduler(){
  const inlineEl = document.getElementById('calendlyInline');
  const fallbackEl = document.getElementById('calendlyFallback');
  if (!inlineEl) return;

  function init(){
    if (window.Calendly && typeof window.Calendly.initInlineWidget === 'function'){
      window.Calendly.initInlineWidget({ url: themedCalendlyUrl(), parentElement: inlineEl });
      return true;
    }
    return false;
  }

  // Calendly's widget.js loads async — poll briefly until it's ready.
  let tries = 0;
  const timer = setInterval(() => {
    if (init()){ clearInterval(timer); return; }
    if (++tries > 40){ // ~8s — assume blocked/offline
      clearInterval(timer);
      if (fallbackEl){ fallbackEl.hidden = false; inlineEl.style.display = 'none'; }
    }
  }, 200);
})();

/* ===== Sticky "Book a call" button ===== */
(function stickyBook(){
  const btn = document.getElementById('stickyBook');
  const contact = document.getElementById('contact');
  if (!btn) return;

  // Show while the user is in the "mid" sections; hide at the hero (top) and
  // at the contact section (where the calendar already lives). Driven by
  // "enter" events (whichever section is crossing the viewport centre).
  const showFor = ['services', 'process', 'stats', 'testimonials', 'about'];
  const ids = ['home', 'services', 'process', 'stats', 'testimonials', 'about', 'contact'];
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) btn.classList.toggle('show', showFor.includes(en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });

  btn.addEventListener('click', () => {
    if (!openCalendly({ service: 'Sticky CTA' })){
      contact && contact.scrollIntoView({ behavior: 'smooth' });
    }
  });
})();

/* ===== Particle network background ===== */
(function particles(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, pts, mouse = { x: -999, y: -999 };
  const COUNT = () => Math.min(90, Math.floor(window.innerWidth / 16));

  function resize(){
    w = canvas.width = window.innerWidth * devicePixelRatio;
    h = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    init();
  }
  function init(){
    pts = [];
    const n = COUNT();
    for (let i = 0; i < n; i++){
      pts.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        r: (Math.random() * 1.6 + 0.6) * devicePixelRatio
      });
    }
  }
  window.addEventListener('mousemove', e => { mouse.x = e.clientX * devicePixelRatio; mouse.y = e.clientY * devicePixelRatio; });
  const LINK = 130 * devicePixelRatio;

  function draw(){
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < pts.length; i++){
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(94,234,212,0.55)';
      ctx.fill();
      for (let j = i + 1; j < pts.length; j++){
        const q = pts[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.hypot(dx, dy);
        if (d < LINK){
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(56,189,248,${0.16 * (1 - d / LINK)})`;
          ctx.lineWidth = devicePixelRatio;
          ctx.stroke();
        }
      }
      // link to mouse
      const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
      const md = Math.hypot(mdx, mdy);
      if (md < LINK * 1.4){
        ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(129,140,248,${0.25 * (1 - md / (LINK * 1.4))})`;
        ctx.lineWidth = devicePixelRatio;
        ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize(); draw();
})();
