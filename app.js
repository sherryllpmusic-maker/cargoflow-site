/* CargoFlow site: the road and truck, scroll effects, the question toy, language switch, and the tap-only demo booking. */
(() => {
  'use strict';
  /* ---- SET THESE BEFORE GOING LIVE ---------------------------------------------------------------------------------------------- */
  const WHATSAPP_NUMBER = '';   // digits with country code, e.g. '919812345678'. The booking opens WhatsApp to this number, so the visitor's own number arrives with it.
  const NTFY_TOPIC = 'cf-demo-e15a63092d421f10a1'; // free phone alerts: install the ntfy app, subscribe to this name, and every booking arrives as a notification with the details and a Call button. No account, no server.
  const DEMO_API = '';          // the CargoFlow server address + /api/public/demo-request (e.g. 'https://your-cargoflow.onrender.com/api/public/demo-request'). Every booking is saved there and the owner is told at once on WhatsApp, email and in the app, with the visitor's number and chosen time. No outside service involved.
  const FORM_ENDPOINT = '';     // optional: a free form service URL (Web3Forms, Formspree...). Booking choices are also posted here so no lead is lost.
  const PHOTOS = [];            // optional: ['assets/photos/truck1.jpg', ...] your own photos; a strip appears when this list has files.
  /* ----------------------------------------------------------------------------------------------------------------------------------- */
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const story = $('#story'), svg = $('#road'), truck = $('#truck');
  const bed = $('#roadBed'), edge = $('#roadEdge'), lit = $('#roadLit'), dash = $('#roadDash');
  let len = 0, y0 = 0, y1 = 1, cur = 0, rw = 60, raf = 0;

  /* ---- road: a path with rounded bends through every stop -------------------------------------------------------------------------- */
  function rounded(pts, R) {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [px, py] = pts[i - 1], [x, y] = pts[i], [nx, ny] = pts[i + 1];
      const a = Math.hypot(x - px, y - py), b = Math.hypot(nx - x, ny - y), r = Math.min(R, a / 2, b / 2);
      const sx = x + ((px - x) / a) * r, sy = y + ((py - y) / a) * r, ex = x + ((nx - x) / b) * r, ey = y + ((ny - y) / b) * r;
      d += ` L${sx.toFixed(1)} ${sy.toFixed(1)} Q${x} ${y} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
    }
    const l = pts[pts.length - 1]; return d + ` L${l[0]} ${l[1]}`;
  }
  function build() {
    const W = story.clientWidth, H = story.scrollHeight, top = story.getBoundingClientRect().top + scrollY;
    svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    rw = Math.max(46, Math.min(78, W * 0.13));
    const at = (el, f = 0.5) => { const r = el.getBoundingClientRect(); return r.top + scrollY - top + r.height * f; };
    const hero = $('.hero'), stops = $$('[data-stop]'), end = $('#book');
    const pts = [[W * 0.5, at(hero, 0.93)]];
    let px = W * 0.5, py = pts[0][1];
    stops.forEach((s, i) => { const nx = W * (i % 2 ? 0.27 : 0.73), ny = at(s, 0.62), my = (py + ny) / 2; pts.push([px, my], [nx, my], [nx, ny]); px = nx; py = ny; });
    const ey = at(end, 0.34), my = (py + ey) / 2; pts.push([px, my], [W * 0.5, my], [W * 0.5, ey]);
    const d = rounded(pts, Math.min(96, W * 0.22));
    [bed, edge, lit, dash].forEach((p) => p.setAttribute('d', d));
    bed.setAttribute('stroke-width', rw); edge.setAttribute('stroke-width', rw + 5); lit.setAttribute('stroke-width', 3); dash.setAttribute('stroke-width', 3);
    len = bed.getTotalLength(); y0 = pts[0][1]; y1 = pts[pts.length - 1][1];
    lit.style.strokeDasharray = len; dash.style.strokeDasharray = '2 18';
    const w = Math.round(rw * 0.64); truck.style.width = w + 'px'; truck.style.height = Math.round(w * 2.4) + 'px';
    place(true);
  }
  function place(snap) {
    const s = scrollY + innerHeight * 0.55, p = Math.max(0, Math.min(1, (s - y0) / (y1 - y0))), target = p * len;
    cur = snap || reduce ? target : cur + (target - cur) * 0.14;
    const a = bed.getPointAtLength(cur), b = bed.getPointAtLength(Math.min(len, cur + 4)), c = bed.getPointAtLength(Math.max(0, cur - 4));
    const ang = Math.atan2(b.y - c.y, b.x - c.x) * 180 / Math.PI - 90, w = truck.offsetWidth, h = truck.offsetHeight;
    truck.style.transform = `translate3d(${a.x - w / 2}px,${a.y - h / 2}px,0) rotate(${ang}deg)`;
    lit.style.strokeDashoffset = len - cur;
    return Math.abs(target - cur) > 0.5;
  }

  /* ---- scroll: truck follows, ghost words slide, panels reveal ----------------------------------------------------------------------- */
  const panels = $$('.panel');
  function frame() {
    raf = 0; const moving = place(false);
    if (!reduce) panels.forEach((p) => { const r = p.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return; p.style.setProperty('--sp', Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight)).toFixed(3)); });
    if (moving) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  addEventListener('scroll', kick, { passive: true });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { build(); kick(); }, 150); });
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  $$('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  // a bright highlight on glass cards follows the finger or mouse
  addEventListener('pointermove', (e) => { const g = e.target.closest && e.target.closest('.glass'); if (!g) return; const r = g.getBoundingClientRect(); g.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(0) + '%'); g.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(0) + '%'); }, { passive: true });

  /* ---- language: English and Hindi -------------------------------------------------------------------------------------------------- */
  let hi = false; const swaps = $$('[data-hi]');
  function lang(on) { hi = on; document.documentElement.lang = on ? 'hi-IN' : 'en-IN'; swaps.forEach((el) => { el.innerHTML = on ? el.dataset.hi : el.dataset.en; }); $('#lang').textContent = on ? 'EN' : 'हिं'; try { localStorage.setItem('cf-lang', on ? 'hi' : 'en'); } catch (e) {} setTimeout(() => { build(); kick(); }, 60); }
  $('#lang').addEventListener('click', () => lang(!hi));
  try { if (localStorage.getItem('cf-lang') === 'hi') lang(true); } catch (e) {}

  /* ---- the question that goes round the office ---------------------------------------------------------------------------------------- */
  const chainEl = $('#chain'), askBtn = $('#askBtn'); let timers = [];
  const links = [['Accountant', 'Diesel wale se poochho.'], ['Diesel desk', 'Tracking wale se poochho.'], ['Tracking desk', 'Driver se poochho.'], ['Driver', 'Seth ji, hisaab toh aapke paas hai.']];
  askBtn.addEventListener('click', () => {
    timers.forEach(clearTimeout); timers = []; chainEl.innerHTML = ''; askBtn.disabled = true;
    const add = (who, txt, cls) => { const li = document.createElement('li'); if (cls) li.className = cls; li.innerHTML = `<b>${who}</b>${txt}`; chainEl.appendChild(li); };
    links.forEach((l, i) => timers.push(setTimeout(() => add(l[0], l[1]), 700 * (i + 1))));
    timers.push(setTimeout(() => { add('CargoFlow', 'One place. One answer. Before you ask.', 'win'); askBtn.disabled = false; askBtn.textContent = 'Ask again'; }, 700 * (links.length + 1) + 200));
  });

  /* ---- photos (optional) -------------------------------------------------------------------------------------------------------------- */
  if (PHOTOS.length) { const s = $('#strip'); PHOTOS.forEach((src) => { const im = new Image(); im.src = src; im.alt = 'On the road in India'; im.loading = 'lazy'; s.appendChild(im); }); $('#road-photos').hidden = false; }

  /* ---- demo booking: four taps, no typing, ends in WhatsApp ---------------------------------------------------------------------------- */
  const sheet = $('#sheet'), bg = $('#sheetBg'), optsEl = $('#opts'), titleEl = $('#sheetT'), footEl = $('#foot'), dots = $$('#dots i');
  const pick = { who: '', pains: [], day: '', slot: '', phone: '' };
  const WHO = [['Fleet owner', 'trucks on the road'], ['Warehouse owner', 'godown, cold store, tanks'], ['Both', 'fleet and warehouse'], ['Manager or accountant', 'I run the day to day']];
  const PAIN = ['Chasing drivers', 'Diesel and fuel', 'Bills and collections', 'Godown stock', 'GST and accounts', 'Reports and decisions'];
  const SLOTS = [['Morning', '10 am to 12'], ['Afternoon', '12 to 3 pm'], ['Evening', '4 to 7 pm']];
  const dayList = () => { const out = [], n = new Date(); for (let i = 0; i < 4; i++) { const d = new Date(n.getFullYear(), n.getMonth(), n.getDate() + i); out.push([i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'long' }), d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })]); } return out; };
  let step = 0, opener = null;
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const opt = (label, sub, on, pressed) => { const b = el('button', 'opt', label + (sub ? `<small>${sub}</small>` : '')); b.type = 'button'; b.setAttribute('aria-pressed', pressed ? 'true' : 'false'); b.addEventListener('click', on); return b; };
  function render() {
    optsEl.innerHTML = ''; footEl.innerHTML = ''; dots.forEach((d, i) => d.classList.toggle('on', i <= step)); optsEl.className = 'opts';
    const back = () => { const b = el('button', 'back', 'Back'); b.type = 'button'; b.onclick = () => { step--; render(); }; return b; };
    if (step === 0) {
      titleEl.textContent = 'Who are you?'; optsEl.classList.add('one');
      WHO.forEach(([l, s]) => optsEl.appendChild(opt(l, s, () => { pick.who = l; step = 1; render(); }, pick.who === l)));
    } else if (step === 1) {
      titleEl.textContent = 'What hurts most? Tap any.';
      PAIN.forEach((p) => optsEl.appendChild(opt(p, '', function () { const i = pick.pains.indexOf(p); i < 0 ? pick.pains.push(p) : pick.pains.splice(i, 1); this.setAttribute('aria-pressed', i < 0); next.disabled = !pick.pains.length; }, pick.pains.includes(p))));
      const next = el('button', 'cta', 'Next'); next.type = 'button'; next.disabled = !pick.pains.length; next.onclick = () => { step = 2; render(); }; footEl.append(back(), next);
    } else if (step === 2) {
      titleEl.textContent = 'When should we show you?';
      optsEl.appendChild(el('p', 'sub', 'Day'));
      dayList().forEach(([l, s]) => optsEl.appendChild(opt(l, s, function () { pick.day = `${l}, ${s}`; $$('.opt[data-g=d]').forEach((o) => o.setAttribute('aria-pressed', 'false')); this.setAttribute('aria-pressed', 'true'); check(); }, pick.day === `${l}, ${s}`)));
      optsEl.appendChild(el('p', 'sub', 'Time'));
      SLOTS.forEach(([l, s]) => optsEl.appendChild(opt(l, s, function () { pick.slot = `${l} (${s})`; $$('.opt[data-g=s]').forEach((o) => o.setAttribute('aria-pressed', 'false')); this.setAttribute('aria-pressed', 'true'); check(); }, pick.slot === `${l} (${s})`)));
      $$('.opt', optsEl).forEach((o, i) => o.dataset.g = i < 4 ? 'd' : 's');
      const next = el('button', 'cta', 'Next'); next.type = 'button'; const check = () => { next.disabled = !(pick.day && pick.slot); }; check(); next.onclick = () => { step = 3; render(); }; footEl.append(back(), next);
    } else {
      titleEl.textContent = 'Your number, we will call you.';
      const alt = el('div', 'alt', ''); const inp = el('input'); inp.type = 'tel'; inp.inputMode = 'numeric'; inp.placeholder = 'Your mobile number'; inp.autocomplete = 'tel'; inp.value = pick.phone || ''; inp.setAttribute('aria-label', 'Your phone number');
      const ok = el('button', 'cta', 'Book my demo'); ok.type = 'button'; let sent = false;
      ok.onclick = () => { if (sent) return; pick.phone = inp.value.trim(); if (pick.phone.replace(/\D/g, '').length < 10) { inp.focus(); inp.setAttribute('aria-invalid', 'true'); return; } sent = true; ok.disabled = true; post(); alt.remove(); footEl.innerHTML = ''; optsEl.appendChild(el('p', 'done', `Thank you. We will call you ${pick.day}, ${pick.slot}.`)); };
      alt.append(inp, ok); optsEl.appendChild(alt);
      footEl.append(back());
    }
  }
  const message = () => `Hi CargoFlow, I would like a demo.\nI am a: ${pick.who}\nBiggest headaches: ${pick.pains.join(', ')}\nBest time: ${pick.day}, ${pick.slot}${pick.phone ? '\nCall me on: ' + pick.phone : ''}`;
  function ntfy() { if (!NTFY_TOPIC) return; const d = pick.phone.replace(/\D/g, '').slice(-10); const body = { topic: NTFY_TOPIC, title: 'CargoFlow demo request' + (pick.phone ? ': ' + pick.phone : ''), message: `${pick.who}
Hurts: ${pick.pains.join(', ')}
Wants demo: ${pick.day}, ${pick.slot}
${pick.phone ? 'Call: ' + pick.phone : 'No number left (they may message on WhatsApp)'}`, priority: 5, tags: ['telephone_receiver'] }; if (d.length === 10) body.actions = [{ action: 'view', label: 'Call now', url: 'tel:+91' + d }]; try { fetch('https://ntfy.sh/', { method: 'POST', body: JSON.stringify(body), keepalive: true }); } catch (e) {} }
  function post() { ntfy(); if (DEMO_API) { try { fetch(DEMO_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ who: pick.who, pains: pick.pains, day: pick.day, slot: pick.slot, phone: pick.phone, message: message() }), keepalive: true }); } catch (e) {} } if (!FORM_ENDPOINT) return; try { fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ subject: 'CargoFlow demo request', ...pick, message: message() }), keepalive: true }); } catch (e) {} }
  function send() {
    post();
    if (WHATSAPP_NUMBER) { location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message())}`; return; }
    // No number set yet: keep the visitor's choices and say so, instead of failing silently.
    console.warn('CargoFlow site: set WHATSAPP_NUMBER in app.js'); optsEl.appendChild(el('p', 'done', 'Booking noted. (Site owner: set WHATSAPP_NUMBER in app.js so this button opens WhatsApp.)'));
    try { navigator.clipboard.writeText(message()); } catch (e) {}
  }
  function open(e) { opener = e && e.currentTarget; step = 0; sheet.hidden = bg.hidden = false; document.body.classList.add('lock'); render(); $('#sheetX').focus(); }
  function close() { sheet.hidden = bg.hidden = true; document.body.classList.remove('lock'); if (opener) opener.focus(); }
  $$('[data-book]').forEach((b) => b.addEventListener('click', open));
  $('#sheetX').addEventListener('click', close); bg.addEventListener('click', close);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) close(); });

  /* ---- start ------------------------------------------------------------------------------------------------------------------------------------ */
  const start = () => { build(); frame(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else addEventListener('load', start);
  addEventListener('load', () => { build(); kick(); });
})();
