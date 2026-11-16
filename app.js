/* Flüsterwald – Lautstärke-Ampel mit Tieren.
 * Alles läuft lokal im Browser. Das Mikrofon wird nur zur Pegelmessung genutzt,
 * es wird nichts aufgenommen oder übertragen. Die Bereiche stehen in scenes/*.js. */
(() => {
  'use strict';

  const SCENES = window.FW.scenes;
  const S = 0.85;               // Grundgröße der Tiere
  const LOUD_GRACE = 0.35;      // so lange (s) muss es laut sein, bevor die Tiere erschrecken
  const STARTLE_COOLDOWN = 1.5; // Pause (s) zwischen zwei Erschreckern

  // ---------- Einstellungen ----------
  const DEFAULTS = { threshold: 55, step: 20, mode: 'one', hidehud: false, scene: 'wald', random: false };
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
    start: $('#start'), startErr: $('#start-error'), grid: $('#scene-grid'),
    meter: $('#meter'), fill: $('#meter .fill'), mark: $('#meter .mark'),
    ring: $('#next .ring'), progress: $('#progress'),
    starCount: $('#star-count'), toast: $('#toast'),
    celebrate: $('#celebrate'), paused: $('#paused'),
    dialog: $('#settings'),
    threshold: $('#set-threshold'), step: $('#set-step'), mode: $('#set-mode'), hidehud: $('#set-hidehud'),
    scene: $('#set-scene'), random: $('#set-random'),
    themeColor: document.querySelector('meta[name="theme-color"]'),
  };
  const svg = document.getElementById('scene');
  const layers = {
    bg: document.getElementById('bg'),
    fg: document.getElementById('fg'),
    back: document.getElementById('layer-back'),
    front: document.getElementById('layer-front'),
    hole: document.getElementById('layer-hole'),
  };
  const holeClip = document.getElementById('holeClipShape');
  const RING_LEN = 2 * Math.PI * 18;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Zustand ----------
  const state = {
    running: false, paused: false, demo: false, demoLoud: false,
    level: 0, visible: 0,
    quietFor: 0, loudFor: 0, cooldown: 0,
    celebrated: false, calibrating: null,
  };

  // ---------- Audio ----------
  let audioCtx, analyser, buf;

  async function startMic() {
    const stream = await navigator.mediaDevices.getUserMedia({
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

  // ---------- Szene ----------
  let scene = null;
  let animals = [];
  let dots = [];
  let outStack = []; // Reihenfolge, in der die Tiere herausgekommen sind
  let mood = null;
  let zOrder = '';

  function loadScene(id) {
    scene = SCENES.find((s) => s.id === id) || SCENES[0];
    layers.bg.innerHTML = scene.back;
    layers.fg.innerHTML = scene.front;
    for (const k of ['back', 'front', 'hole']) layers[k].replaceChildren();
    const h = scene.hole;
    holeClip.setAttribute('cx', h ? h.x : -100); holeClip.setAttribute('cy', h ? h.y : -100);
    holeClip.setAttribute('rx', h ? h.rx : 1); holeClip.setAttribute('ry', h ? h.ry : 1);
    document.body.style.background = scene.bg;
    document.body.dataset.scene = scene.id;
    els.themeColor.setAttribute('content', scene.bg);
    mood = layers.bg.querySelector('#mood');

    animals = scene.animals.map((cfg) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      el.setAttribute('class', 'animal ' + cfg.kind);
      el.setAttribute('aria-label', cfg.name);
      el.innerHTML = cfg.art;
      layers.back.appendChild(el);
      return {
        cfg, el, s: S * (cfg.s || 1),
        x: 0, y: 2000, dir: 1, bob: 0, phase: Math.random() * 6, tilt: 0,
        layer: 'back', mode: 'hidden', cover: null, steps: [], cur: null,
      };
    });
    els.progress.replaceChildren();
    // Fortschrittsleiste: kleine Bilder der Tiere dieses Bereichs
    dots = animals.map((a) => {
      const d = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      d.setAttribute('class', 'dot');
      d.setAttribute('role', 'img');
      d.setAttribute('aria-label', a.cfg.name);
      d.innerHTML = `<g>${a.cfg.art}</g>`;
      els.progress.appendChild(d);
      const b = d.firstChild.getBBox();
      const m = Math.max(b.width, b.height) * 0.04;
      d.setAttribute('viewBox', `${b.x - m} ${b.y - m} ${b.width + 2 * m} ${b.height + 2 * m}`);
      return d;
    });
    zOrder = '';
    syncScenePickers();
    reset();
  }

  // ---------- Tiere ----------
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = {
    lin: (p) => p,
    out: (p) => 1 - (1 - p) * (1 - p),
    in: (p) => p * p,
    io: (p) => (p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p)),
  };
  const flies = (a) => a.cfg.kind === 'fly' || a.cfg.kind === 'swim';
  const laneOf = (a) => a.cfg.lane || scene.lane;

  // Sichtbarer Bereich (auf schmalen Bildschirmen wird links/rechts abgeschnitten)
  function viewRange() {
    const r = svg.getBoundingClientRect();
    const scale = Math.max(r.width / 1600, r.height / 900) || 1;
    const w = Math.min(1600, r.width / scale);
    return { min: 800 - w / 2, max: 800 + w / 2 };
  }
  function visibleCovers(a) {
    const v = viewRange();
    // große Tiere (big) nutzen nur große Verstecke, sofern es welche gibt
    const all = a.cfg.big && scene.covers.some((c) => c.big) ? scene.covers.filter((c) => c.big) : scene.covers;
    let list = all.filter((c) => c.x > v.min + 40 && c.x < v.max - 40);
    if (!list.length) list = [all.reduce((p, q) => (Math.abs(p.x - 800) < Math.abs(q.x - 800) ? p : q))];
    const h = scene.hole;
    if (h && a.cfg.kind === 'fly' && h.x > v.min + 40 && h.x < v.max - 40) list = list.concat({ ...h, hole: true }, { ...h, hole: true });
    return list;
  }

  // Positionen rund um ein Versteck
  const hiddenPos = (a, c, x) => (c.hole
    ? { x: c.x, y: c.y + c.ry + 2 + a.cfg.h * a.s }
    : { x, y: scene.ground + a.cfg.h * a.s + 10 });
  const peekPos = (a, c, x) => (c.hole
    ? { x: c.x, y: c.y - c.ry + 12 + a.cfg.eye * a.s }
    : { x, y: c.top - 14 + a.cfg.eye * a.s });
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
    const swim = a.cfg.kind === 'swim';
    return move(x, y, 0.4 + d / (a.cfg.speed * fast), {
      ease: 'io', gait: swim ? 'swim' : 'fly', arc: swim ? Math.min(60, d * 0.08) : Math.min(160, 40 + d * 0.18),
    });
  };
  function plan(a, steps) { a.steps = steps; a.cur = null; }

  // --- Verhalten ---
  function placeHidden(a) {
    const c = pick(visibleCovers(a));
    a.cover = c;
    setLayer(a, c.hole ? 'hole' : 'back');
    Object.assign(a, hiddenPos(a, c, coverX(c)));
    a.mode = 'hidden'; a.bob = 0; a.tilt = 0;
    a.el.classList.remove('out', 'flying', 'moving');
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
    if (flies(a)) {
      const exit = c.hole ? { x: c.x, y: peek.y } : { x: peek.x, y: c.top - 8 };
      if (!c.hole) steps.push(move(exit.x, exit.y, 0.35, { ease: 'out' }));
      const t = pickSpot(a);
      steps.push(layer('front'), flyTo(a, exit, t.x, t.y), call(() => roam(a)));
    } else {
      const v = viewRange();
      const [l0, l1] = laneOf(a);
      const tx = clamp(peek.x + (Math.random() < 0.5 ? -1 : 1) * rand(90, 170), v.min + 70, v.max - 70);
      steps.push(
        move(peek.x, c.top - 6, 0.35, { ease: 'out' }), // hochspringen
        layer('front'),
        move(tx, rand(l0, l1), 0.5, { ease: 'in' }), // nach vorn
        call(() => roam(a)),
      );
    }
    plan(a, steps);
  }

  // Ziel für Flieger und Schwimmer: Sitzplatz oder freier Punkt
  function pickSpot(a) {
    const v = viewRange();
    const area = a.cfg.area || scene.air;
    const perches = (a.cfg.perches || scene.perches || [])
      .filter((p) => p.x > v.min + 50 && p.x < v.max - 50 && Math.hypot(p.x - a.x, p.y - a.y) > 60);
    if (area && (!perches.length || Math.random() < (a.cfg.kind === 'swim' ? 0.85 : 0.4))) {
      const top = Math.min(area.y1, Math.max(area.y0, 150 + a.cfg.h * a.s)); // nicht über die Anzeige oben
      return { x: rand(Math.max(area.x0, v.min + 70), Math.min(area.x1, v.max - 70)), y: rand(top, area.y1) };
    }
    return perches.length ? pick(perches) : { x: (v.min + v.max) / 2, y: 200 };
  }

  // Herumlaufen / -fliegen / -schwimmen, solange es ruhig bleibt
  function roam(a) {
    if (a.mode !== 'out') return;
    if (reduceMotion) { plan(a, [wait(5, true), call(() => roam(a))]); return; }
    if (flies(a)) {
      const t = pickSpot(a);
      const pause = a.cfg.kind === 'swim' ? rand(0.5, 2.5) : rand(2.5, 6);
      plan(a, [wait(pause, true), flyTo(a, a, t.x, t.y), call(() => roam(a))]);
      return;
    }
    const v = viewRange();
    const [l0, l1] = laneOf(a);
    plan(a, [wait(rand(0.8, 4), Math.random() < 0.6), walkTo(a, rand(v.min + 80, v.max - 80), rand(l0, l1)), call(() => roam(a))]);
  }

  // Flucht ins nächste Versteck
  function flee(a) {
    if (a.mode === 'hidden') return;
    a.el.classList.remove('out');
    a.mode = 'flee';
    if (a.layer !== 'front') {
      // war noch beim Hervorlugen: einfach wieder abtauchen
      const h = hiddenPos(a, a.cover, a.x);
      plan(a, [move(h.x, h.y, 0.3, { ease: 'in' }), call(() => { a.mode = 'hidden'; })]);
      return;
    }
    const c = visibleCovers(a).reduce((best, k) => (Math.abs(k.x - a.x) < Math.abs(best.x - a.x) ? k : best));
    a.cover = c;
    const x = coverX(c);
    const h = hiddenPos(a, c, x);
    let steps;
    if (flies(a)) {
      const entry = c.hole ? { x: c.x, y: peekPos(a, c, c.x).y } : { x, y: c.top - 8 };
      steps = [flyTo(a, a, entry.x, entry.y, 2.5), layer(c.hole ? 'hole' : 'back')];
    } else {
      const [l0, l1] = laneOf(a);
      steps = [
        walkTo(a, x, clamp(a.y, l0, l1), 2.6),
        move(x, c.top - 6, 0.3, { ease: 'out' }), // hineinspringen
        layer('back'),
      ];
    }
    steps.push(move(h.x, h.y, 0.3, { ease: 'in' }), call(() => { a.mode = 'hidden'; }));
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
    a.el.classList.toggle('moving', !!(s && s.type === 'move' && s.gait));
    a.phase += dt;
    if (!s) { a.bob *= 0.8; a.tilt = 0; return; }
    s.t += dt;
    const p = Math.min(1, s.t / s.dur);
    if (s.type === 'move') {
      const e = ease[s.ease](p);
      a.x = s.x0 + (s.x - s.x0) * e;
      a.y = s.y0 + (s.y - s.y0) * e - s.arc * Math.sin(Math.PI * p);
      if (s.gait === 'walk') {
        const ph = a.phase * a.cfg.freq * Math.PI;
        a.bob = -Math.abs(Math.sin(ph)) * a.cfg.hop;
        a.tilt = a.cfg.tilt ? Math.sin(ph * 2) * a.cfg.tilt : 0;
      } else if (s.gait === 'fly') {
        a.bob = Math.sin(s.t * 9) * 4;
      } else if (s.gait === 'swim') {
        a.bob = Math.sin(a.phase * 2.2) * 8;
        a.tilt = Math.sin(a.phase * 2.2) * 4;
      } else { a.bob = 0; a.tilt = 0; }
    } else if (s.type === 'wait') {
      // Schwimmer schweben auf der Stelle, alle anderen stehen still
      if (a.cfg.kind === 'swim' && a.mode === 'out') a.bob = Math.sin(a.phase * 1.6) * 6;
      else { a.bob *= 0.8; a.tilt = 0; }
      if (s.look && !s.flipped && p > 0.5) { a.dir *= -1; s.flipped = true; } // umschauen
    }
    if (p >= 1) a.cur = null;
  }

  function updateAnimals(dt) {
    for (const a of animals) {
      updateAnimal(a, dt);
      a.el.setAttribute('transform',
        `translate(${a.x.toFixed(1)} ${(a.y + a.bob).toFixed(1)}) rotate(${a.tilt.toFixed(1)}) scale(${(a.s * a.dir).toFixed(3)} ${a.s.toFixed(3)})`);
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
    if (!hidden.length || outStack.length >= animals.length) return;
    const a = pick(hidden);
    outStack.push(a);
    emerge(a);
    render();
    if (outStack.length === animals.length && !state.celebrated) celebrate();
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
        s.textContent = ['⭐', '✨', '🌟', scene.icon][i % 4];
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
          if (state.visible < animals.length) {
            state.quietFor += dt;
            if (state.quietFor >= settings.step) { state.quietFor = 0; showNext(); }
          }
        }
        const frac = state.visible >= animals.length ? 1 : state.quietFor / settings.step;
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
    if (mood) mood.classList.toggle('loud', loud);
  }

  function applySettings() {
    els.mark.style.left = settings.threshold + '%';
    els.threshold.value = settings.threshold;
    els.step.value = String(settings.step);
    els.mode.value = settings.mode;
    els.hidehud.checked = settings.hidehud;
    els.random.checked = settings.random;
    document.body.classList.toggle('hidehud', settings.hidehud);
  }

  // ---------- Bereichsauswahl ----------
  let chosen = settings.scene;
  for (const sc of SCENES) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'scene-card'; b.dataset.id = sc.id;
    b.setAttribute('role', 'radio');
    b.innerHTML = `<span class="ic">${sc.icon}</span><span class="nm">${sc.name}</span>`;
    b.addEventListener('click', () => { chosen = sc.id; syncScenePickers(); if (!state.running) loadScene(sc.id); });
    els.grid.appendChild(b);
    els.scene.add(new Option(`${sc.icon} ${sc.name}`, sc.id));
  }
  function syncScenePickers() {
    for (const b of els.grid.children) b.setAttribute('aria-checked', String(b.dataset.id === chosen));
    if (scene) els.scene.value = scene.id;
  }
  function useScene(id) {
    settings.scene = id; saveSettings();
    if (!scene || scene.id !== id) loadScene(id);
  }

  // ---------- Kalibrieren ----------
  function calibrate() {
    if (state.calibrating) return;
    if (!state.running) { toast('Erst „Los geht\'s“ drücken', 2000); return; }
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
    if (!state.running) {
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
    }
    if (settings.random && !state.running) {
      const others = SCENES.filter((s) => s.id !== settings.scene);
      chosen = (others.length ? pick(others) : SCENES[0]).id;
    }
    state.running = true;
    els.start.hidden = true;
    if (state.paused) togglePause();
    useScene(chosen);
    reset();
    if (state.demo) toast('Vorschau: Taste L gedrückt halten = laut', 3000);
  }

  function openScenes() {
    chosen = scene.id;
    syncScenePickers();
    els.start.hidden = false;
    $('#btn-start').textContent = state.running ? '▶ Weiter' : "🎤 Los geht's";
    $('#btn-demo').hidden = state.running;
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
  $('#btn-scenes').addEventListener('click', openScenes);
  $('#btn-pause').addEventListener('click', togglePause);
  $('#btn-reset').addEventListener('click', reset);
  $('#btn-full').addEventListener('click', toggleFullscreen);
  $('#btn-settings').addEventListener('click', () => els.dialog.showModal());
  $('#btn-calibrate').addEventListener('click', calibrate);

  els.threshold.addEventListener('input', () => { settings.threshold = +els.threshold.value; saveSettings(); applySettings(); });
  els.step.addEventListener('change', () => { settings.step = +els.step.value; saveSettings(); });
  els.mode.addEventListener('change', () => { settings.mode = els.mode.value; saveSettings(); });
  els.hidehud.addEventListener('change', () => { settings.hidehud = els.hidehud.checked; saveSettings(); applySettings(); });
  els.random.addEventListener('change', () => { settings.random = els.random.checked; saveSettings(); });
  els.scene.addEventListener('change', () => { chosen = els.scene.value; useScene(chosen); });

  document.addEventListener('keydown', (e) => {
    if (els.dialog.open || e.target.closest('input, select')) return;
    switch (e.key.toLowerCase()) {
      case ' ': e.preventDefault(); togglePause(); break;
      case 'r': reset(); break;
      case 'f': toggleFullscreen(); break;
      case 'e': els.dialog.showModal(); break;
      case 'b': openScenes(); break;
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
  window.fluesterwald = {
    state, settings, showNext, startle, reset, loadScene,
    get animals() { return animals; }, get scene() { return scene; },
  };

  applySettings();
  loadScene(settings.scene);
  requestAnimationFrame(tick);
})();
