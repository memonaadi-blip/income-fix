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
  const iconSrc = card.querySelector('.cf-icon') || card.querySelector('.svc-icon');
  modalEls.icon.innerHTML = iconSrc ? '<svg viewBox="0 0 48 48" width="40" height="40">' + iconSrc.innerHTML + '</svg>' : '';
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

// Expose for the coverflow module (which decides click = open vs navigate)
window.__openService = openModal;

// Make each service card accessible; opening is handled by the coverflow module
document.querySelectorAll('.service-card').forEach(card => {
  card.setAttribute('role', 'button');
  card.setAttribute('aria-haspopup', 'dialog');
  card.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && card.classList.contains('active')) {
      e.preventDefault(); openModal(card);
    }
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

/* ===== Finance-data animated background (original, sample-styled) =====
   Coin stacks receding into depth, overlaid with animated finance data — a
   big % counter, donut, pie, bar chart, horizontal data bars and a plotting
   line — plus a faint tiled FINANSYS watermark. Brand palette, kept behind
   the content at moderate opacity so text stays readable. */
(function financeBackground(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, dpr;

  const GOLD='199,170,138', GOLDL='224,205,178', DEEP='150,120,88', STEEL='120,134,158', IVORY='232,226,216';

  let line = [], back = [], front = [];
  const bars = Array.from({length:7}, () => ({ base:0.35+Math.random()*0.45, ph:Math.random()*6.28, sp:0.35+Math.random()*0.4 }));
  function buildLine(){ line=[]; let v=0.5; for(let i=0;i<26;i++){ v+=(Math.random()-0.5)*0.12; v=Math.max(0.2,Math.min(0.82,v)); line.push({v,ph:Math.random()*6.28}); } }
  function buildStacks(){
    back=[]; front=[];
    const bn=Math.max(6,Math.round(w/150)), fn=Math.max(4,Math.round(w/230));
    for(let i=0;i<bn;i++) back.push({ x:(i+0.5)/bn, coins:7+(Math.random()*5|0), rx:Math.min(30,w*0.026), baseY:0.60+Math.random()*0.08, ph:Math.random()*6.28 });
    for(let i=0;i<fn;i++) front.push({ x:(i+0.5)/fn+ (Math.random()-0.5)*0.04, coins:11+(Math.random()*6|0), rx:Math.min(52,w*0.05), baseY:1.03+Math.random()*0.04, ph:Math.random()*6.28 });
  }

  function resize(){
    dpr=Math.min(devicePixelRatio||1,2); w=innerWidth; h=innerHeight;
    canvas.width=w*dpr; canvas.height=h*dpr; canvas.style.width=w+'px'; canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0); buildStacks();
  }

  function coin(cx,cy,rx,ry,a){
    ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,6.2832); ctx.fillStyle=`rgba(${GOLD},${a})`; ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx,cy-ry*0.28,rx*0.8,ry*0.5,0,0,6.2832); ctx.fillStyle=`rgba(${GOLDL},${a*0.55})`; ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,6.2832); ctx.strokeStyle=`rgba(${DEEP},${a*0.8})`; ctx.lineWidth=1; ctx.stroke();
  }
  function stacks(list,t,fr){
    list.forEach(s=>{
      const cx=s.x*w+Math.sin(t*0.22+s.ph)*3, rx=s.rx, ry=rx*0.3, gap=ry*1.5, baseY=s.baseY*h;
      for(let c=0;c<s.coins;c++){
        const y=baseY-c*gap-Math.sin(t*0.4+s.ph+c*0.14)*1.0;
        const a=(fr?0.12:0.055)+(fr?0.10:0.05)*(c/s.coins);
        coin(cx,y,rx,ry,a);
      }
    });
  }
  function watermark(){
    ctx.save(); ctx.translate(w/2,h/2); ctx.rotate(-0.32);
    ctx.font=`700 ${Math.round(Math.min(58,w*0.046))}px 'Space Grotesk',sans-serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle=`rgba(${IVORY},0.035)`;
    const stepX=Math.max(300,w*0.34), stepY=120; let r=0;
    for(let yy=-h;yy<h;yy+=stepY,r++) for(let xx=-w;xx<w;xx+=stepX) ctx.fillText('FINANSYS', xx+(r%2?stepX/2:0), yy);
    ctx.restore();
  }
  function grid(){ ctx.lineWidth=1; for(let i=1;i<7;i++){ const y=h*i/7; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.strokeStyle=`rgba(${STEEL},0.045)`; ctx.stroke(); } }

  function areaLine(t,prog){
    const x0=w*0.04,x1=w*0.96,y0=h*0.34,y1=h*0.6,n=line.length;
    const X=i=>x0+(i/(n-1))*(x1-x0), Y=i=>y1-(line[i].v+Math.sin(t*0.4+line[i].ph)*0.02)*(y1-y0);
    const lead=prog*(n-1); ctx.beginPath(); let lx=null,ly=null,m=Math.min(n-1,Math.floor(lead));
    for(let i=0;i<=m;i++){ const x=X(i),y=Y(i); i?ctx.lineTo(x,y):ctx.moveTo(x,y); lx=x; ly=y; }
    if(lx!=null){ ctx.lineTo(lx,y1); ctx.lineTo(X(0),y1); ctx.closePath(); ctx.fillStyle=`rgba(${GOLD},0.05)`; ctx.fill(); }
    ctx.beginPath(); for(let i=0;i<=m;i++){ const x=X(i),y=Y(i); i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
    ctx.strokeStyle=`rgba(${GOLD},0.4)`; ctx.lineWidth=2; ctx.lineJoin='round'; ctx.stroke();
    if(lx!=null){ ctx.beginPath(); ctx.arc(lx,ly,3,0,6.2832); ctx.fillStyle=`rgba(${GOLDL},0.9)`; ctx.fill(); }
  }
  function barChart(t){
    const bx=w*0.09,base=h*0.72,bw=12,gap=10;
    bars.forEach((b,i)=>{ const hgt=(b.base+Math.sin(t*b.sp+b.ph)*0.16)*h*0.14, x=bx+i*(bw+gap);
      ctx.fillStyle=`rgba(${GOLD},0.16)`; ctx.fillRect(x,base-hgt,bw,hgt);
      ctx.fillStyle=`rgba(${GOLDL},0.24)`; ctx.fillRect(x,base-hgt,bw,3); });
    ctx.strokeStyle=`rgba(${STEEL},0.12)`; ctx.beginPath(); ctx.moveTo(bx-6,base); ctx.lineTo(bx+bars.length*(bw+gap),base); ctx.stroke();
  }
  function donut(t){
    const cx=w*0.86,cy=h*0.26,r=Math.min(60,w*0.052),p=0.5+0.18*Math.sin(t*0.22);
    ctx.lineWidth=Math.max(7,r*0.16); ctx.strokeStyle=`rgba(${STEEL},0.16)`; ctx.beginPath(); ctx.arc(cx,cy,r,0,6.2832); ctx.stroke();
    ctx.strokeStyle=`rgba(${GOLD},0.5)`; ctx.lineCap='round'; ctx.beginPath(); ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+p*6.2832); ctx.stroke(); ctx.lineCap='butt';
    ctx.fillStyle=`rgba(${IVORY},0.5)`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.font=`600 ${Math.round(r*0.5)}px 'Space Grotesk',sans-serif`; ctx.fillText(Math.round(p*100)+'%',cx,cy);
  }
  function pie(t){
    const cx=w*0.52,cy=h*0.15,r=Math.min(44,w*0.036),segs=[0.4,0.34,0.26],cols=[`rgba(${GOLD},0.3)`,`rgba(${STEEL},0.26)`,`rgba(${GOLDL},0.22)`]; let s=-Math.PI/2+t*0.05;
    segs.forEach((sg,i)=>{ const e=s+sg*6.2832; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,s,e); ctx.closePath(); ctx.fillStyle=cols[i]; ctx.fill(); s=e; });
  }
  function pctCounter(t){
    const x=w*0.13,y=h*0.19,val=Math.round(52+14*Math.sin(t*0.2));
    ctx.textAlign='left'; ctx.textBaseline='alphabetic';
    ctx.fillStyle=`rgba(${IVORY},0.32)`; ctx.font=`700 ${Math.round(Math.min(60,w*0.047))}px 'Space Grotesk',sans-serif`; ctx.fillText(val+'%',x,y);
    ctx.fillStyle=`rgba(${GOLD},0.4)`; ctx.font=`600 ${Math.round(Math.min(14,w*0.011))}px Inter,sans-serif`; ctx.fillText('YoY GROWTH',x,y+18);
  }
  function hbars(t){
    const x=w*0.7,y=h*0.44;
    for(let i=0;i<6;i++){ const len=36+(Math.sin(t*0.4+i*0.6)*0.5+0.5)*118,yy=y+i*13;
      ctx.strokeStyle=i%2?`rgba(${GOLD},0.2)`:`rgba(${STEEL},0.18)`; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(x,yy); ctx.lineTo(x+len,yy); ctx.stroke(); }
    ctx.strokeStyle=`rgba(${STEEL},0.12)`; ctx.lineWidth=1; ctx.strokeRect(x-14,y-16,150,6*13+6);
  }

  let start=null;
  function frame(ts){
    if(start==null) start=ts; const el=(ts-start)/1000;
    let prog=reduced?1:Math.min(el/2.6,1); prog=1-Math.pow(1-prog,3);
    ctx.clearRect(0,0,w,h);
    grid();
    stacks(back,el,false);
    watermark();
    areaLine(el,prog); barChart(el); hbars(el); pctCounter(el); pie(el); donut(el);
    stacks(front,el,true);
    if(!reduced) requestAnimationFrame(frame);
  }
  function startAll(){ resize(); buildLine(); start=null; requestAnimationFrame(frame); }
  addEventListener('resize',()=>{ resize(); if(reduced) requestAnimationFrame(frame); });
  startAll();
})();

/* ===== Intro laptop login scene ===== */
(function intro(){
  const intro = document.getElementById('intro');
  if (!intro) return;
  const cursor = document.getElementById('introCursor');
  const stage  = document.getElementById('introStage');
  const login  = document.getElementById('screenLogin');
  const skip   = document.getElementById('introSkip');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('intro-lock');
  let entered = false, done = false;

  function finish(){
    if (done) return; done = true;
    document.body.classList.remove('intro-lock');
    intro.classList.add('gone');
    setTimeout(() => intro.remove(), 1000);
  }
  function enter(){
    if (entered) return; entered = true;
    login.classList.add('press');
    const lap = document.getElementById('introLaptop');

    if (window.Motion && lap){
      // Motion-driven: slow tilt to a 3/4 angle, then accelerate the screen
      // toward the viewer past the edges (enter-the-screen), with motion blur.
      lap.style.transition = 'none';
      intro.classList.add('exiting');            // fade base / hinge / login UI
      Motion.animate(lap,
        { rotateX: [6, 9, 2], rotateY: [-8, -23, -4], scale: [1, 1.16, 13],
          filter: ['blur(0px)', 'blur(0px)', 'blur(4px)'] },
        { duration: 2.2, offset: [0, 0.34, 1], easing: ['ease-out', [0.5, 0, 0.9, 0.28]] });
      setTimeout(() => intro.classList.add('gone'), 1650);   // reveal site as it fills
      setTimeout(finish, 2350);
    } else {
      // CSS fallback
      setTimeout(() => intro.classList.add('tilt'), 140);
      setTimeout(() => intro.classList.add('zoom'), 980);
      setTimeout(() => intro.classList.add('gone'), 2150);
      setTimeout(finish, 3050);
    }
  }
  login.addEventListener('click', enter);
  skip.addEventListener('click', () => { intro.classList.add('gone'); setTimeout(finish, 260); });

  if (reduced){ finish(); return; }
  if (location.search.includes('hold')) return;   // pause auto-play (manual login)

  setTimeout(() => {
    const sr = stage.getBoundingClientRect(), br = login.getBoundingClientRect();
    cursor.style.left = ((br.left + br.width/2 - sr.left) / sr.width) * 100 + '%';
    cursor.style.top  = ((br.top  + br.height/2 - sr.top) / sr.height) * 100 + '%';
  }, 850);
  setTimeout(() => { cursor.classList.add('click'); login.classList.add('press'); }, 2150);
  setTimeout(() => { cursor.classList.remove('click'); login.classList.remove('press'); enter(); }, 2450);
})();

/* ===== Services coverflow carousel ===== */
(function coverflow(){
  const vp = document.getElementById('cfViewport');
  if (!vp) return;
  const cards = [...vp.querySelectorAll('.cf-card')];
  const dotsWrap = document.getElementById('cfDots');
  const prev = document.getElementById('cfPrev'), next = document.getElementById('cfNext');
  const n = cards.length;
  let active = 0, timer = null;

  cards.forEach((c, i) => {
    const d = document.createElement('button');
    d.className = 'cf-dot'; d.setAttribute('aria-label', 'Service ' + (i+1));
    d.addEventListener('click', () => { go(i); restart(); });
    dotsWrap.appendChild(d);
  });
  const dots = [...dotsWrap.children];

  // With Motion available, let it own transform/opacity (springy ease); CSS keeps shadow/border.
  const M = window.Motion;
  if (M) cards.forEach(c => { c.style.transition = 'box-shadow .5s, border-color .5s'; });

  function layout(){
    cards.forEach((card, i) => {
      let off = i - active;
      if (off >  n/2) off -= n;
      if (off < -n/2) off += n;
      const abs = Math.abs(off);
      const x = off * 152, ry = off * -22, tz = abs === 0 ? 0 : (-165*abs - 30),
            sc = abs === 0 ? 1 : Math.max(0.72, 0.9 - abs*0.06), op = abs > 2 ? 0 : 1;
      card.style.zIndex = String(100 - abs);
      card.style.pointerEvents = abs > 2 ? 'none' : 'auto';
      if (M){
        M.animate(card, { x: [null, x], z: [null, tz], rotateY: [null, ry], scale: [null, sc], opacity: [null, op] },
          { duration: 0.6, easing: [0.34, 1.12, 0.64, 1] });
      } else {
        card.style.transform = `translateX(${x}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${sc})`;
        card.style.opacity = String(op);
      }
      card.classList.toggle('active', off === 0);
      card.setAttribute('tabindex', off === 0 ? '0' : '-1');
    });
    dots.forEach((d, i) => d.classList.toggle('on', i === active));
  }
  function go(i){ active = ((i % n) + n) % n; layout(); }
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function restart(){ clearInterval(timer); if (reducedMotion) return; timer = setInterval(() => go(active + 1), 5000); }
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearInterval(timer); else restart(); });

  prev.addEventListener('click', () => { go(active - 1); restart(); });
  next.addEventListener('click', () => { go(active + 1); restart(); });
  cards.forEach((card, i) => card.addEventListener('click', () => {
    if (i === active) { if (window.__openService) window.__openService(card); }
    else { go(i); restart(); }
  }));

  let sx = null;
  vp.addEventListener('pointerdown', e => { sx = e.clientX; });
  window.addEventListener('pointerup', e => {
    if (sx == null) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 50){ dx < 0 ? go(active+1) : go(active-1); restart(); }
    sx = null;
  });
  const wrap = vp.parentElement;
  wrap.addEventListener('mouseenter', () => clearInterval(timer));
  wrap.addEventListener('mouseleave', restart);

  layout(); restart();
})();

/* ===== Background video: reduced-motion aware play + pause control (WCAG 2.2.2) ===== */
(function bgVideoControls(){
  const v = document.getElementById('bgVideo');
  const btn = document.getElementById('bgToggle');
  if (!v || !btn) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let wantPlay = !reduced;                      // reduced-motion → stay on the static poster

  function reflect(){
    const playing = !v.paused;
    btn.classList.toggle('paused', !playing);
    btn.setAttribute('aria-pressed', String(!playing));
    btn.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
  }
  function play(){ const p = v.play(); if (p && p.catch) p.catch(() => {}); }

  if (wantPlay) play(); else v.pause();
  reflect();

  btn.addEventListener('click', () => {
    if (v.paused){ wantPlay = true; play(); } else { wantPlay = false; v.pause(); }
    reflect();
  });
  v.addEventListener('play', reflect);
  v.addEventListener('pause', reflect);
  // stop off-screen / when tab hidden; resume only if the user wants it playing
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) v.pause(); else if (wantPlay) play();
  });
})();
