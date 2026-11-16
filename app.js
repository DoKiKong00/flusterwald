/* Flüsterwald – Lautstärke-Ampel mit Waldtieren.
 * Alles läuft lokal im Browser. Das Mikrofon wird nur zur Pegelmessung genutzt,
 * es wird nichts aufgenommen oder übertragen. */
(() => {
  'use strict';

  // Tier-Eigenschaften: h = Höhe, eye = Augenhöhe (beides in Zeichen-Einheiten),
  // speed = Laufgeschwindigkeit, hop/freq = Hüpfhöhe und -takt beim Laufen
  const ANIMALS = [
    { id: 'a-bunny',    icon: '🐰', h: 200, eye: 106, speed: 170, hop: 30, freq: 2.4, kind: 'walk' },
    { id: 'a-hedgehog', icon: '🦔', h: 95,  eye: 40,  speed: 70,  hop: 3,  freq: 6,   kind: 'walk', tilt: 4 },
    { id: 'a-squirrel', icon: '🐿️', h: 135, eye: 88,  speed: 230, hop: 22, freq: 3.6, kind: 'walk' },
    { id: 'a-fox',      icon: '🦊', h: 160, eye: 98,  speed: 150, hop: 6,  freq: 3.2, kind: 'walk' },
    { id: 'a-owl',      icon: '🦉', h: 100, eye: 57,  speed: 300, kind: 'fly' },
    { id: 'a-deer',     icon: '🦌', h: 230, eye: 204, speed: 130, hop: 8,  freq: 2.2, kind: 'walk' },
  ];
  const S = 0.85;              // Grundgröße der Tiere
  const GROUND = 700;          // Oberkante der Wiese (Szenen-Koordinaten)
  const LANE = [758, 805];     // hier laufen die Tiere auf der Wiese
  // Verstecke: x = Mitte, top = Oberkante, w = nutzbare Breite
  const COVERS = [
    { id: 'mound',   x: 270,  top: 668, w: 140 },
    { id: 'bush',    x: 560,  top: 650, w: 120 },
    { id: 'log',     x: 855,  top: 642, w: 150 },
    { id: 'bigbush', x: 1450, top: 612, w: 160 },
  ];
  const HOLE = { id: 'hole', x: 1150, y: 400, hole: true }; // Baumhöhle (nur für die Eule)
  // Sitzplätze für die Eule
  const PERCHES = [
    { x: 1335, y: 548 }, { x: 1015, y: 160 }, { x: 1285, y: 150 }, { x: 1150, y: 40 },
    { x: 820, y: 642 }, { x: 900, y: 642 }, { x: 270, y: 672 }, { x: 560, y: 652 }, { x: 1450, y: 614 },
  ];

  const LOUD_GRACE = 0.35;   // so lange (s) muss es laut sein, bevor die Tiere erschrecken
  const STARTLE_COOLDOWN = 1.5; // Pause (s) zwischen zwei Erschreckern

  // ---------- Einstellungen ----------
  const DEFAULTS = { threshold: 55, step: 20, mode: 'one', hidehud: false };
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem('fw.' + key); return v === null ? fallback : JSON.parse(v); }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('fw.' + key, JSON.stringify(value)); } catch { /* egal */ }
    },
  };
  const settings = Object.assign({}, DEFAULTS, store.get('settings', {}));
  const saveSettings = () => store.set('settings', settings);

  // Sterne zählen pro Tag
  const today = new Date().toISOString().slice(0, 10);
  let stars = store.get('stars', { day: today, count: 0 });
  if (stars.day !== today) stars = { day: today, count: 0 };

  // ---------- DOM ----------
  const $ = (s) => document.querySelector(s);
  const els = {
    start: $('#start'), startErr: $('#start-error'),
    meter: $('#meter'), fill: $('#meter .fill'), mark: $('#meter .mark'),
    sun: $('#sun'), ring: $('#next .ring'), progress: $('#progress'),
    starCount: $('#star-count'), toast: $('#toast'),
    celebrate: $('#celebrate'), paused: $('#paused'),
    dialog: $('#settings'),
    threshold: $('#set-threshold'), step: $('#set-step'), mode: $('#set-mode'), hidehud: $('#set-hidehud'),
  };
  const dots = ANIMALS.map((a) => {
    const d = document.createElement('span');
    d.className = 'dot'; d.textContent = a.icon;
    els.progress.appendChild(d);
    return d;
  });
  const RING_LEN = 2 * Math.PI * 18;

  // ---------- Zustand ----------
  const state = {
    running: false, paused: false, demo: false, demoLoud: false,
    level: 0, visible: 0,
    quietFor: 0, loudFor: 0, cooldown: 0,
    celebrated: false, calibrating: null,
  };

  // ---------- Audio ----------
  let audioCtx, analyser, buf, stream;

  async function startMic() {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    src.connect(analyser);
    buf = new Float32Array(analyser.fftSize);
  }

  // Pegel 0–100 (−60 dB … −10 dB)
  function readLevel() {
    if (state.demo) return state.demoLoud ? 80 + Math.random() * 10 : 12 + Math.random() * 8;
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);
    const db = 20 * Math.log10(rms + 1e-9);
    return Math.max(0, Math.min(100, ((db + 60) / 50) * 100));
  }

  // ---------- Tiere ----------
  const svg = document.getElementById('scene');
  const layers = {
    back: document.getElementById('layer-back'),
    front: document.getElementById('layer-front'),
    hole: document.getElementById('layer-hole'),
  };
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const ease = {
    lin: (p) => p,
    out: (p) => 1 - (1 - p) * (1 - p),
    in: (p) => p * p,
    io: (p) => (p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p)),
  };

  const animals = ANIMALS.map((cfg) => ({
    cfg, el: document.getElementById(cfg.id),
    x: 0, y: 1000, dir: 1, bob: 0, phase: 0, tilt: 0,
    layer: 'back', mode: 'hidden', cover: null,
    steps: [], cur: null,
  }));
  // Reihenfolge, in der die Tiere herausgekommen sind (das letzte erschrickt zuerst)
  let outStack = [];

  // Sichtbarer Bereich der Szene (auf schmalen Bildschirmen wird links/rechts abgeschnitten)
  function viewRange() {
    const r = svg.getBoundingClientRect();
    const scale = Math.max(r.width / 1600, r.height / 900) || 1;
    const w = Math.min(1600, r.width / scale);
    return { min: 800 - w / 2, max: 800 + w / 2 };
  }
  const visibleCovers = (withHole) => {
    const v = viewRange();
    let list = COVERS.filter((c) => c.x > v.min + 40 && c.x < v.max - 40);
    if (!list.length) list = [COVERS.reduce((a, b) => (Math.abs(a.x - 800) < Math.abs(b.x - 800) ? a : b))];
    if (withHole && HOLE.x > v.min + 40 && HOLE.x < v.max - 40) list = list.concat(HOLE, HOLE); // Eule mag die Höhle
    return list;
  };

  // Positionen rund um ein Versteck
  const hiddenPos = (a, c, x) => (c.hole
    ? { x: c.x, y: c.y + 50 + a.cfg.h * S }
    : { x, y: GROUND + a.cfg.h * S + 10 });
  const peekPos = (a, c, x) => (c.hole
    ? { x: c.x, y: c.y + 52 }
    : { x, y: c.top - 14 + a.cfg.eye * S });
  const coverX = (c) => (c.hole ? c.x : c.x + rand(-c.w, c.w) * 0.25);

  function setLayer(a, name) {
    a.layer = name;
    layers[name].appendChild(a.el);
  }

  // --- Schritt-Warteschlange ---
  const move = (x, y, dur, opts = {}) => ({ type: 'move', x, y, dur, ease: 'io', arc: 0, gait: null, ...opts });
  const wait = (dur, look = false) => ({ type: 'wait', dur, look });
  const layer = (name) => ({ type: 'layer', name });
  const call = (fn) => ({ type: 'call', fn });
  const walkTo = (a, x, y, fast = 1) => {
    const d = Math.hypot(x - a.x, y - a.y);
    return move(x, y, Math.max(0.2, d / (a.cfg.speed * fast)), { ease: 'lin', gait: 'walk' });
  };
  const flyTo = (a, from, x, y, fast = 1) => {
    const d = Math.hypot(x - from.x, y - from.y);
    return move(x, y, 0.4 + d / (a.cfg.speed * fast), { ease: 'io', gait: 'fly', arc: Math.min(160, 40 + d * 0.18) });
  };
  function plan(a, steps) { a.steps = steps; a.cur = null; }

  // --- Verhalten ---
  function placeHidden(a) {
    const c = pick(visibleCovers(a.cfg.kind === 'fly'));
    const x = coverX(c);
    a.cover = c;
    setLayer(a, c.hole ? 'hole' : 'back');
    Object.assign(a, hiddenPos(a, c, x));
    a.mode = 'hidden'; a.bob = 0; a.tilt = 0;
    a.el.classList.remove('out', 'flying');
    plan(a, []);
  }

  function emerge(a) {
    placeHidden(a); // jedes Mal ein neues, zufälliges Versteck
    a.mode = 'peek';
    const c = a.cover;
    const peek = peekPos(a, c, a.x);
    const steps = [
      move(peek.x, peek.y, 1.4, { ease: 'out' }),
      wait(rand(0.8, 1.8), true),
      call(() => { a.mode = 'out'; a.el.classList.add('out'); }),
    ];
    if (a.cfg.kind === 'fly') {
      const p = pickPerch(a);
      if (c.hole) steps.push(layer('front'));
      else steps.push(move(peek.x, c.top - 8, 0.35, { ease: 'out' }), layer('front'));
      steps.push(flyTo(a, { x: peek.x, y: c.hole ? peek.y : c.top - 8 }, p.x, p.y), call(() => roam(a)));
    } else {
      const v = viewRange();
      const tx = Math.max(v.min + 70, Math.min(v.max - 70, peek.x + (Math.random() < 0.5 ? -1 : 1) * rand(90, 170)));
      steps.push(
        move(peek.x, c.top - 6, 0.35, { ease: 'out' }), // hochspringen
        layer('front'),
        move(tx, rand(LANE[0], LANE[1]), 0.5, { ease: 'in' }), // nach vorn auf die Wiese
        call(() => roam(a)),
      );
    }
    plan(a, steps);
  }

  function pickPerch(a) {
    const v = viewRange();
    let list = PERCHES.filter((p) => p.x > v.min + 50 && p.x < v.max - 50 && Math.hypot(p.x - a.x, p.y - a.y) > 60);
    if (!list.length) list = [{ x: (v.min + v.max) / 2, y: 200 }];
    return pick(list);
  }

  // Herumlaufen / -fliegen, solange es ruhig bleibt
  function roam(a) {
    if (a.mode !== 'out') return;
    if (reduceMotion) { plan(a, [wait(5, true), call(() => roam(a))]); return; }
    if (a.cfg.kind === 'fly') {
      const p = pickPerch(a);
      plan(a, [wait(rand(3, 7), true), flyTo(a, a, p.x, p.y), call(() => roam(a))]);
      return;
    }
    const v = viewRange();
    const tx = rand(v.min + 80, v.max - 80);
    const ty = rand(LANE[0], LANE[1]);
    plan(a, [wait(rand(0.8, 4), Math.random() < 0.6), walkTo(a, tx, ty), call(() => roam(a))]);
  }

  // Flucht ins nächste Versteck
  function flee(a) {
    if (a.mode === 'hidden') return;
    a.el.classList.remove('out');
    if (a.layer !== 'front') {
      // war noch beim Hervorlugen: einfach wieder abtauchen
      a.mode = 'flee';
      const h = hiddenPos(a, a.cover, a.x);
      plan(a, [move(h.x, h.y, 0.3, { ease: 'in' }), call(() => { a.mode = 'hidden'; })]);
      return;
    }
    a.mode = 'flee';
    const options = visibleCovers(a.cfg.kind === 'fly');
    const c = options.reduce((best, k) => (Math.abs(k.x - a.x) < Math.abs(best.x - a.x) ? k : best));
    a.cover = c;
    const x = coverX(c);
    const h = hiddenPos(a, c, x);
    let steps;
    if (a.cfg.kind === 'fly') {
      const entry = c.hole ? { x: c.x, y: c.y + 52 } : { x, y: c.top - 8 };
      steps = [flyTo(a, a, entry.x, entry.y, 2.5), layer(c.hole ? 'hole' : 'back')];
    } else {
      steps = [
        walkTo(a, x, Math.max(LANE[0], Math.min(LANE[1], a.y)), 2.6),
        move(x, c.top - 6, 0.3, { ease: 'out' }), // hineinspringen
        layer('back'),
      ];
    }
    steps.push(move(h.x, h.y, 0.3, { ease: 'in' }), call(() => { a.mode = 'hidden'; a.el.classList.remove('flying'); }));
    plan(a, steps);
  }

  // --- Bewegung pro Bild ---
  function updateAnimal(a, dt) {
    let budget = 20; // Sofort-Schritte (layer/call) im selben Bild abarbeiten
    while (!a.cur && a.steps.length && budget--) {
      const s = a.steps.shift();
      if (s.type === 'layer') { setLayer(a, s.name); continue; }
      if (s.type === 'call') { s.fn(); continue; }
      a.cur = { ...s, t: 0, x0: a.x, y0: a.y, flipped: false };
      if (s.type === 'move' && Math.abs(s.x - a.x) > 2) a.dir = s.x > a.x ? 1 : -1;
    }
    const s = a.cur;
    a.el.classList.toggle('flying', !!(s && s.gait === 'fly'));
    if (!s) { a.bob *= 0.8; a.tilt = 0; return; }
    s.t += dt;
    const p = Math.min(1, s.t / s.dur);
    if (s.type === 'move') {
      const e = ease[s.ease](p);
      a.x = s.x0 + (s.x - s.x0) * e;
      a.y = s.y0 + (s.y - s.y0) * e - s.arc * Math.sin(Math.PI * p);
      if (s.gait === 'walk') {
        a.phase += dt * a.cfg.freq * Math.PI;
        a.bob = -Math.abs(Math.sin(a.phase)) * a.cfg.hop;
        a.tilt = a.cfg.tilt ? Math.sin(a.phase * 2) * a.cfg.tilt : 0;
      } else if (s.gait === 'fly') {
        a.bob = Math.sin(s.t * 9) * 4;
      } else { a.bob = 0; a.tilt = 0; }
    } else if (s.type === 'wait') {
      a.bob *= 0.8; a.tilt = 0;
      if (s.look && !s.flipped && p > 0.5) { a.dir *= -1; s.flipped = true; } // umschauen
    }
    if (p >= 1) a.cur = null;
  }

  let zOrder = '';
  function updateAnimals(dt) {
    for (const a of animals) {
      updateAnimal(a, dt);
      a.el.setAttribute('transform',
        `translate(${a.x.toFixed(1)} ${(a.y + a.bob).toFixed(1)}) rotate(${a.tilt.toFixed(1)}) scale(${S * a.dir} ${S})`);
    }
    // weiter unten im Bild = weiter vorne
    const front = animals.filter((a) => a.layer === 'front').sort((p, q) => p.y - q.y);
    const key = front.map((a) => a.cfg.id).join();
    if (key !== zOrder) { zOrder = key; front.forEach((a) => layers.front.appendChild(a.el)); }
  }

  // --- Spiel-Logik ---
  function render() {
    state.visible = outStack.length;
    dots.forEach((d, i) => d.classList.toggle('on', outStack.includes(animals[i])));
    els.starCount.textContent = stars.count;
  }

  function showNext() {
    const hidden = animals.filter((a) => a.mode === 'hidden' && !outStack.includes(a));
    if (!hidden.length || outStack.length >= ANIMALS.length) return;
    const a = pick(hidden);
    outStack.push(a);
    emerge(a);
    render();
    if (outStack.length === ANIMALS.length && !state.celebrated) celebrate();
  }

  function startle() {
    if (!outStack.length) return;
    const leaving = settings.mode === 'all' ? outStack.splice(0) : [outStack.pop()];
    leaving.forEach(flee);
    state.celebrated = false;
    els.celebrate.hidden = true;
    render();
    els.progress.classList.remove('shake'); void els.progress.offsetWidth; els.progress.classList.add('shake');
    toast('Huch! Zu laut! 🙉');
  }

  function celebrate() {
    state.celebrated = true;
    stars.count++; store.set('stars', stars); render();
    els.celebrate.hidden = false;
    if (!reduceMotion) {
      for (let i = 0; i < 26; i++) {
        const s = document.createElement('span');
        s.className = 'sparkle';
        s.textContent = ['⭐', '✨', '🌟', '🍃'][i % 4];
        s.style.left = Math.random() * 100 + 'vw';
        s.style.top = '0';
        s.style.animationDelay = Math.random() * 1.2 + 's';
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 4200);
      }
    }
    setTimeout(() => { els.celebrate.hidden = true; }, 5000);
  }

  function reset() {
    state.quietFor = 0; state.loudFor = 0; state.celebrated = false;
    outStack = [];
    animals.forEach(placeHidden);
    els.celebrate.hidden = true;
    render();
  }

  let toastTimer;
  function toast(msg, ms = 1600) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), ms);
  }

  // ---------- Hauptschleife ----------
  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;

    if (state.running) {
      const raw = readLevel();
      // schnell hoch, langsam runter
      const k = raw > state.level ? 0.35 : 0.08;
      state.level += (raw - state.level) * k;

      if (state.calibrating) state.calibrating.push(raw);

      const loud = state.level > settings.threshold;
      updateMeter(loud);

      if (!state.paused && !state.calibrating) {
        state.cooldown = Math.max(0, state.cooldown - dt);
        if (loud) {
          state.loudFor += dt;
          state.quietFor = 0;
          if (state.loudFor >= LOUD_GRACE && state.cooldown === 0) {
            startle();
            state.cooldown = STARTLE_COOLDOWN;
          }
        } else {
          state.loudFor = 0;
          if (state.visible < ANIMALS.length) {
            state.quietFor += dt;
            if (state.quietFor >= settings.step) { state.quietFor = 0; showNext(); }
          }
        }
        const frac = state.visible >= ANIMALS.length ? 1 : state.quietFor / settings.step;
        els.ring.style.strokeDashoffset = RING_LEN * (1 - frac);
      }
    }
    if (!state.paused) updateAnimals(dt);
    requestAnimationFrame(tick);
  }

  function updateMeter(loud) {
    els.fill.style.width = state.level.toFixed(1) + '%';
    els.meter.classList.toggle('over', loud);
    els.meter.classList.toggle('near', !loud && state.level > settings.threshold * 0.8);
    els.sun.classList.toggle('loud', loud);
  }

  function applySettings() {
    els.mark.style.left = settings.threshold + '%';
    els.threshold.value = settings.threshold;
    els.step.value = String(settings.step);
    els.mode.value = settings.mode;
    els.hidehud.checked = settings.hidehud;
    document.body.classList.toggle('hidehud', settings.hidehud);
  }

  // ---------- Kalibrieren ----------
  function calibrate() {
    if (state.calibrating) return;
    state.calibrating = [];
    const btn = $('#btn-calibrate');
    btn.disabled = true;
    let n = 3;
    btn.textContent = `🤫 Psst … ${n}`;
    const iv = setInterval(() => {
      n--;
      if (n > 0) { btn.textContent = `🤫 Psst … ${n}`; return; }
      clearInterval(iv);
      const samples = state.calibrating.slice().sort((a, b) => a - b);
      state.calibrating = null;
      const p90 = samples[Math.floor(samples.length * 0.9)] || 30;
      settings.threshold = Math.round(Math.min(90, Math.max(20, p90 + 12)));
      saveSettings(); applySettings();
      btn.disabled = false;
      btn.textContent = '✅ Eingemessen';
      setTimeout(() => { btn.textContent = '🎯 Raum einmessen'; }, 2000);
    }, 1000);
  }

  // ---------- Bedienung ----------
  async function begin(demo) {
    els.startErr.hidden = true;
    state.demo = demo;
    if (!demo) {
      try { await startMic(); }
      catch (e) {
        els.startErr.textContent = e && e.name === 'NotAllowedError'
          ? 'Das Mikrofon wurde nicht erlaubt. Bitte im Browser oben in der Adressleiste das Mikrofon freigeben und erneut versuchen.'
          : 'Es wurde kein Mikrofon gefunden. Ist eines angeschlossen?';
        els.startErr.hidden = false;
        return;
      }
    }
    state.running = true;
    els.start.hidden = true;
    reset();
    if (demo) toast('Vorschau: Taste L gedrückt halten = laut', 3000);
  }

  function togglePause() {
    if (!state.running) return;
    state.paused = !state.paused;
    els.paused.hidden = !state.paused;
    $('#btn-pause').textContent = state.paused ? '▶' : '⏸';
    if (audioCtx) state.paused ? audioCtx.suspend() : audioCtx.resume();
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  }

  $('#btn-start').addEventListener('click', () => begin(false));
  $('#btn-demo').addEventListener('click', () => begin(true));
  $('#btn-pause').addEventListener('click', togglePause);
  $('#btn-reset').addEventListener('click', reset);
  $('#btn-full').addEventListener('click', toggleFullscreen);
  $('#btn-settings').addEventListener('click', () => els.dialog.showModal());
  $('#btn-calibrate').addEventListener('click', calibrate);

  els.threshold.addEventListener('input', () => { settings.threshold = +els.threshold.value; saveSettings(); applySettings(); });
  els.step.addEventListener('change', () => { settings.step = +els.step.value; saveSettings(); });
  els.mode.addEventListener('change', () => { settings.mode = els.mode.value; saveSettings(); });
  els.hidehud.addEventListener('change', () => { settings.hidehud = els.hidehud.checked; saveSettings(); applySettings(); });

  document.addEventListener('keydown', (e) => {
    if (els.dialog.open || e.target.closest('input, select')) return;
    switch (e.key.toLowerCase()) {
      case ' ': e.preventDefault(); togglePause(); break;
      case 'r': reset(); break;
      case 'f': toggleFullscreen(); break;
      case 'e': els.dialog.showModal(); break;
      case 'l': state.demoLoud = true; break;
    }
  });
  document.addEventListener('keyup', (e) => { if (e.key.toLowerCase() === 'l') state.demoLoud = false; });

  // Bedienknöpfe nach 4 s ohne Mausbewegung ausblenden (für den Beamer)
  let idleTimer;
  const wake = () => {
    document.body.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (state.running && !els.dialog.open) document.body.classList.add('idle'); }, 4000);
  };
  ['mousemove', 'pointerdown', 'keydown'].forEach((ev) => document.addEventListener(ev, wake));

  // ---------- Als App (PWA) ----------
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => { /* ohne Offline-Modus weiter */ });
  }
  const isInstalled = matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || navigator.standalone;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let installPrompt = null;
  if (!isInstalled && isIOS) {
    $('#install').hidden = false;
    $('#btn-install').hidden = true;
    $('#install-ios').hidden = false;
  }
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPrompt = e;
    $('#install').hidden = false;
  });
  $('#btn-install').addEventListener('click', async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice.catch(() => {});
    installPrompt = null;
    $('#install').hidden = true;
  });
  window.addEventListener('appinstalled', () => { $('#install').hidden = true; toast('Installiert! 🎉', 2500); });

  // Für Tests und Vorschau
  window.fluesterwald = { state, settings, showNext, startle, reset, animals };

  applySettings();
  reset();
  requestAnimationFrame(tick);
})();
