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
    eyebrow: 'Grow your capital',
    formValue: 'Investment Advisory',
    lede: 'A disciplined, risk-aware investment strategy engineered to grow and protect your capital — built around your goals and horizon, then reviewed as markets move.',
    includes: ['Risk profile & goal mapping', 'Diversified portfolio construction', 'Ongoing monitoring & rebalancing', 'Periodic performance reviews', 'Direct access to your advisor'],
    for: 'Individuals and businesses with capital to deploy who want professional, conflict-free guidance instead of guesswork.',
    pricing: '<b>Advisory</b> retainer'
  },
  'Tax Planning': {
    eyebrow: 'Keep more of it',
    formValue: 'Tax Planning',
    lede: 'Proactive, year-round tax strategy — not a once-a-year scramble. We structure your affairs to legally minimise liability and keep you fully compliant.',
    includes: ['Year-round tax strategy', 'Deduction & exemption optimisation', 'Income & entity structuring', 'Return preparation & filing', 'Notice & assessment support'],
    for: 'Businesses, professionals and high earners with complex or growing income who want to pay only what they truly owe.',
    pricing: '<b>Annual</b> engagement'
  },
  'REIT Registrations': {
    eyebrow: 'Launch your REIT',
    formValue: 'REIT Registrations',
    lede: 'End-to-end support to structure, register and launch a Real Estate Investment Trust — from feasibility and documentation to regulatory approval.',
    includes: ['REIT structuring & feasibility', 'Scheme & trust documentation', 'Regulatory (SECP) filing & liaison', 'RMC / trustee coordination', 'Compliance & reporting setup'],
    for: 'Real-estate developers, sponsors and investors looking to launch or convert assets into a regulated REIT vehicle.',
    pricing: '<b>Project-based</b>'
  },
  'ERP Implementation': {
    eyebrow: 'Systemise your finance',
    formValue: 'ERP Implementation',
    lede: 'We plan, configure and roll out financial ERP systems that unify your accounting, reporting and operations — with your team trained and confident.',
    includes: ['Requirements & process mapping', 'System selection & configuration', 'Data migration & integration', 'Chart of accounts & controls', 'Training & go-live support'],
    for: 'Growing companies replacing spreadsheets or legacy tools who want one reliable financial system of record.',
    pricing: '<b>Scoped</b> to your business'
  },
  'Business Finance': {
    eyebrow: 'Scale with clarity',
    formValue: 'Business Finance',
    lede: 'Outsourced finance leadership — from forecasting and budgeting to funding readiness — giving your business the clarity to make confident decisions and scale.',
    includes: ['Budgeting & cash-flow forecasting', 'Management reporting & KPIs', 'Financial modelling & analysis', 'Funding & investor readiness', 'Quarterly strategy sessions'],
    for: 'Founders and SMEs who need a financial co-pilot and board-ready numbers without a full-time CFO.',
    pricing: '<b>Monthly</b> retainer'
  },
  'Bookkeeping & Financial Services': {
    eyebrow: 'Books, handled',
    formValue: 'Bookkeeping & Financial Services',
    lede: 'Accurate, up-to-date books and the day-to-day financial services that keep your business compliant, audit-ready and running smoothly.',
    includes: ['Day-to-day bookkeeping & reconciliation', 'Accounts payable & receivable', 'Payroll & statutory compliance', 'Monthly financial statements', 'Year-end & audit support'],
    for: 'Businesses that want clean, reliable books and dependable financial operations handled for them.',
    pricing: '<b>Flexible</b> monthly plans'
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
  return CALENDLY_URL + sep + 'background_color=182132&text_color=e8e2d8&primary_color=c7aa8a&hide_gdpr_banner=1';
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

/* ===== Animated financial-chart background =====
   A calm, self-drawing line chart (value axis + month gridlines + plotting
   markers) inspired by a trading/forecast chart — light and unobtrusive so it
   sits behind the content. */
(function chartBackground(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, dpr;
  const months  = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const yVals   = [10000, 8000, 6000, 4000, 2000, 0, -2000, -4000, -6000, -8000];
  const vMin = -8000, vMax = 10000;
  const padL = 66, padR = 26, padT = 54, padB = 60;
  let series = [];

  // Build a smooth-ish random-walk series with a gentle upward drift
  function makeSeries(color, glow, volatility, base){
    const n = 26, pts = [];
    let v = base + (Math.random() - 0.5) * 1400;
    for (let i = 0; i < n; i++){
      v += (Math.random() - 0.5) * volatility + 70; // drift up
      v = Math.max(vMin + 600, Math.min(vMax - 600, v));
      pts.push({ v, phase: Math.random() * Math.PI * 2 });
    }
    return { color, glow, pts };
  }
  function build(){
    series = [
      makeSeries('rgba(199,170,138,0.60)', 'rgba(216,190,158,0.95)', 2600, 1200),  // primary (gold)
      makeSeries('rgba(120,134,158,0.28)', null,                     1700, -1200)  // secondary (steel)
    ];
  }

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const yOf = v => padT + (1 - (v - vMin) / (vMax - vMin)) * (h - padT - padB);
  const xOf = (i, n) => padL + (i / (n - 1)) * (w - padL - padR);

  function drawGrid(){
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    yVals.forEach(v => {
      const y = yOf(v);
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y);
      ctx.strokeStyle = 'rgba(148,163,184,0.08)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = 'rgba(148,163,184,0.30)'; ctx.textAlign = 'right';
      ctx.fillText(v.toLocaleString(), padL - 12, y);
    });
    ctx.setLineDash([4, 6]);
    months.forEach((m, i) => {
      const x = padL + (i / (months.length - 1)) * (w - padL - padR);
      ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, h - padB);
      ctx.strokeStyle = 'rgba(148,163,184,0.07)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = 'rgba(148,163,184,0.32)'; ctx.textAlign = 'center';
      ctx.fillText(m, x, h - padB + 24);
    });
    ctx.setLineDash([]);
  }

  function drawSeries(s, progress, time){
    const n = s.pts.length, total = n - 1;
    const lead = progress * total;            // fractional index reached
    const drift = i => Math.sin(time * 0.0006 + s.pts[i].phase) * 200; // subtle "live" motion
    let lx = null, ly = null;

    ctx.beginPath();
    for (let i = 0; i < n && i <= lead; i++){
      const x = xOf(i, n), y = yOf(s.pts[i].v + drift(i));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      lx = x; ly = y;
    }
    const i0 = Math.floor(lead), frac = lead - i0;          // partial leading segment
    if (i0 < n - 1 && frac > 0){
      const x0 = xOf(i0, n),   y0 = yOf(s.pts[i0].v   + drift(i0));
      const x1 = xOf(i0 + 1, n), y1 = yOf(s.pts[i0 + 1].v + drift(i0 + 1));
      lx = x0 + (x1 - x0) * frac; ly = y0 + (y1 - y0) * frac;
      ctx.lineTo(lx, ly);
    }
    ctx.strokeStyle = s.color; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.stroke();

    for (let i = 0; i <= i0 && i < n; i++){               // markers at reached points
      const x = xOf(i, n), y = yOf(s.pts[i].v + drift(i));
      ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = s.color; ctx.fill();
    }
    if (s.glow && lx != null){                            // pulsing leading dot
      const r = 3 + Math.sin(time * 0.005) * 1.1;
      ctx.beginPath(); ctx.arc(lx, ly, r + 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(216,190,158,0.18)'; ctx.fill();
      ctx.beginPath(); ctx.arc(lx, ly, r, 0, Math.PI * 2);
      ctx.fillStyle = s.glow; ctx.fill();
    }
  }

  let start = null;
  function frame(ts){
    if (start == null) start = ts;
    const elapsed = ts - start;
    let p = reduced ? 1 : Math.min(elapsed / 2600, 1);
    p = 1 - Math.pow(1 - p, 3);                            // ease-out draw
    ctx.clearRect(0, 0, w, h);
    drawGrid();
    series.forEach(s => drawSeries(s, p, reduced ? 0 : elapsed));
    if (!reduced) requestAnimationFrame(frame);
  }

  function startAll(){ resize(); build(); start = null; requestAnimationFrame(frame); }
  window.addEventListener('resize', () => { resize(); if (reduced) requestAnimationFrame(frame); });
  startAll();
})();
