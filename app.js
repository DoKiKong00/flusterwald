/* Flüsterwald – Lautstärke-Ampel mit Tieren.
 * Alles läuft lokal im Browser. Das Mikrofon wird nur zur Pegelmessung genutzt,
 * es wird nichts aufgenommen oder übertragen. Die Bereiche stehen in scenes/*.js. */
(() => {
  'use strict';

  const SCENES = window.FW.scenes;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const S = 0.85;               // Grundgröße der Tiere
  const BACK = 0.72;            // Größe hinten (bei den Verstecken) …
  const FRONT = 1.12;           // … und ganz vorne (Perspektive)
  const LANE_BOTTOM = 845;      // Laufbereich unten (wird an den Bildschirm angepasst)
  const LOUD_GRACE = 0.35;      // so lange (s) muss es laut sein, bevor die Tiere erschrecken
  const STARTLE_COOLDOWN = 1.5; // Pause (s) zwischen zwei Erschreckern

  // ---------- Einstellungen ----------
  const DEFAULTS = { threshold: 55, step: 15, mode: 'some', max: 30, hidehud: false, scene: 'wald', random: false, awake: true };
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
  if (settings.mode === 'one' && !store.get('modeChosen', false)) settings.mode = DEFAULTS.mode;
  const saveSettings = () => store.set('settings', settings);

  // Sterne zählen pro Tag
  const today = new Date().toISOString().slice(0, 10);
  let stars = store.get('stars', { day: today, count: 0 });
  if (stars.day !== today) stars = { day: today, count: 0 };

  // Sammelalbum: { bereich: { tier: anzahl } }
  const album = store.get('album', {});
  let albumNew = store.get('albumNew', false);

  // ---------- DOM ----------
  const $ = (s) => document.querySelector(s);
  const els = {
    start: $('#start'), startErr: $('#start-error'), grid: $('#scene-grid'),
    meter: $('#meter'), fill: $('#meter .fill'), mark: $('#meter .mark'),
    ring: $('#next .ring'), starCount: $('#star-count'), toast: $('#toast'),
    dialog: $('#settings'),
    threshold: $('#set-threshold'), step: $('#set-step'), mode: $('#set-mode'), max: $('#set-max'), hidehud: $('#set-hidehud'),
    scene: $('#set-scene'), random: $('#set-random'), awake: $('#set-awake'), awakeStatus: $('#awake-status'),
    albumDlg: $('#album'), albumTabs: $('#album-tabs'), albumGrid: $('#album-grid'), albumCount: $('#album-count'),
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
    level: 0, shown: 0, visible: 0,
    quietFor: 0, loudFor: 0, cooldown: 0,
    celebrated: false, calibrating: null,
  };

  // ---------- Audio ----------
  let audioCtx, analyser, buf, stream;
  let silentFor = 0;    // so lange (s) kam nur exakte Stille – Zeichen für ein hängendes Mikrofon
  let restarting = false;

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
    silentFor = 0;
    if (audioCtx.state !== 'running') audioCtx.resume().catch(() => {});
  }

  // Mikrofon neu verbinden (z. B. nach Unterbrechung durch das Betriebssystem)
  async function restartMic() {
    if (restarting || state.demo) return;
    restarting = true;
    try {
      stream?.getTracks().forEach((t) => t.stop());
      await audioCtx?.close().catch(() => {});
      await startMic();
    } catch { /* nächster Versuch beim nächsten Antippen */ }
    restarting = false;
  }

  // Prüfen, ob das Mikrofon noch läuft; sonst wieder anwerfen
  function checkMic() {
    if (!state.running || state.demo || !audioCtx) return;
    const track = stream && stream.getAudioTracks()[0];
    if (!track || track.readyState === 'ended' || silentFor > 4) restartMic();
    else if (audioCtx.state !== 'running') audioCtx.resume().catch(() => {});
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkMic(); });
  document.addEventListener('pointerdown', checkMic);
  document.addEventListener('keydown', checkMic);
  setInterval(checkMic, 3000);

  // Pegel 0–100 (−60 dB … −10 dB)
  function readLevel(dt = 0) {
    if (state.demo) return state.demoLoud ? 80 + Math.random() * 10 : 12 + Math.random() * 8;
    if (!analyser) return 0;
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    // Ein echtes Mikrofon rauscht immer ein wenig; exakt 0 heißt: es kommt nichts an
    silentFor = sum === 0 ? silentFor + dt : 0;
    const rms = Math.sqrt(sum / buf.length);
    const db = 20 * Math.log10(rms + 1e-9);
    return Math.max(0, Math.min(100, ((db + 60) / 50) * 100));
  }

  // ---------- Szene ----------
  // Die Landschaft wird um "shift" nach oben geschoben (gekippte Perspektive):
  // so entsteht vorne mehr Wiese, auf der die Tiere herumlaufen können.
  let scene = null;   // Szene mit umgerechneten Koordinaten
  let animals = [];   // alle Tier-Exemplare, die gerade im Bild sind (auch doppelte)
  let outStack = [];  // Reihenfolge, in der sie herausgekommen sind
  let mood = null;
  let moodWrap = null;
  let zOrder = '';

  function prepare(def) {
    const sh = def.shift ?? 120;
    const up = (o) => (o ? { ...o, y: o.y - sh } : o);
    return {
      ...def, sh,
      ground: def.ground - sh,
      lane: [def.ground - sh + 34, LANE_BOTTOM],
      covers: def.covers.map((c) => ({ ...c, top: c.top - sh })),
      hole: up(def.hole),
      perches: (def.perches || []).map(up).filter((q) => q.y > 140), // nicht unter die Anzeigen oben
      air: def.air && { ...def.air, y0: def.air.y0 - sh, y1: Math.min(def.air.y1 - sh + 60, LANE_BOTTOM - 120) },
      animals: def.animals.map((a) => ({
        ...a,
        area: a.area && { ...a.area, y0: a.area.y0 - sh, y1: a.area.y1 - sh + 60 },
        perches: a.perches && a.perches.map(up),
      })),
    };
  }

  function loadScene(id) {
    const def = SCENES.find((s) => s.id === id) || SCENES[0];
    scene = prepare(def);
    const shiftT = `translate(0 ${-scene.sh})`;
    layers.bg.innerHTML = def.back;
    // Boden nach unten und zur Seite verlängern (für hohe oder sehr breite Bildschirme)
    const u = def.under || '#7cc35a';
    layers.fg.innerHTML = `<rect x="-4000" y="${def.ground}" width="4000" height="900" fill="${u}"/>`
      + `<rect x="1600" y="${def.ground}" width="4000" height="900" fill="${u}"/>`
      + `<rect x="-4000" y="880" width="9600" height="4000" fill="${u}"/>`
      + def.front;
    layers.bg.setAttribute('transform', shiftT);
    layers.fg.setAttribute('transform', shiftT);
    for (const k of ['back', 'front', 'hole']) layers[k].replaceChildren();
    animals = []; outStack = [];
    const h = scene.hole;
    holeClip.setAttribute('cx', h ? h.x : -100); holeClip.setAttribute('cy', h ? h.y : -100);
    holeClip.setAttribute('rx', h ? h.rx : 1); holeClip.setAttribute('ry', h ? h.ry : 1);
    document.body.style.background = def.bg;
    document.body.dataset.scene = def.id;
    els.themeColor.setAttribute('content', def.bg);
    // Himmel (erstes Rechteck der Szene) zur Seite verlängern
    const sky = layers.bg.querySelector('rect');
    if (sky && sky.getAttribute('width') === '1600') { sky.setAttribute('x', '-4000'); sky.setAttribute('width', '9600'); }
    mood = layers.bg.querySelector('#mood');
    moodWrap = null;
    if (mood) { // Stimmungsfigur einpacken, damit sie immer im sichtbaren Bereich bleibt
      moodWrap = document.createElementNS(SVGNS, 'g');
      mood.before(moodWrap); moodWrap.appendChild(mood);
    }
    fitScene();
    zOrder = '';
    syncScenePickers();
    reset();
  }

  // ---------- Bildausschnitt ----------
  // Die Szene ist 1600 × 900 groß.
  //  - Querformat bis 16:9 (Laptop, Whiteboard, Tablet quer): ganze Breite, oben/unten mehr Himmel/Boden
  //  - breiter als 16:9 (Handy quer): oben etwas Himmel weglassen; extrem breit: seitlich verlängern
  //  - Hochformat: mindestens 1000 breit, darüber/darunter Himmel/Boden
  const view = { x: 0, y: 0, w: 1600, h: 900 };
  function fitScene() {
    const rw = window.innerWidth || 1600, rh = window.innerHeight || 900;
    const a = rw / rh;
    let x = 0, y = 0, w = 1600, h = 900;
    if (a >= 1600 / 900) {
      h = Math.max(640, 1600 / a);
      w = h * a;
      x = 800 - w / 2;
      y = Math.max(0, 880 - h);
    } else if (a >= 1) {
      h = 1600 / a;
      y = -(h - 900) * 0.5;
    } else {
      w = Math.min(1600, Math.max(1000, 1600 * a));
      h = w / a;
      x = 800 - w / 2;
      y = -(h - 900) * 0.62;
    }
    Object.assign(view, { x, y, w, h });
    svg.setAttribute('viewBox', `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
    if (moodWrap && scene) {
      const follow = scene.moodFixed ? 0 : scene.sh; // Stimmungsfigur nicht mit der Landschaft hochschieben
      moodWrap.setAttribute('transform', `translate(${Math.max(0, x).toFixed(1)} ${(Math.max(0, y) + follow).toFixed(1)})`);
    }
  }
  addEventListener('resize', fitScene);
  addEventListener('orientationchange', () => setTimeout(fitScene, 200));

  // Laufbereich: von den Verstecken bis kurz vor den unteren Bildschirmrand
  const lane = () => [scene.lane[0], clamp(view.y + view.h - 70, scene.lane[0] + 120, 1300)];

  function viewRange() {
    return { min: Math.max(-200, view.x), max: Math.min(1800, view.x + view.w) };
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

  // Größe je nach Tiefe: hinten bei den Verstecken klein, vorne groß
  const backScale = (a) => (flies(a) ? a.s * 0.9 : a.s * BACK);
  function scaleOf(a) {
    if (flies(a) || a.layer !== 'front') return backScale(a);
    const [l0, l1] = lane();
    const k = clamp((a.y - l0) / (l1 - l0), 0, 1);
    return a.s * (BACK + (FRONT - BACK) * k);
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
    ? { x: c.x, y: c.y + c.ry + 2 + a.cfg.h * backScale(a) }
    : { x, y: scene.ground + a.cfg.h * backScale(a) + 10 });
  const peekPos = (a, c, x) => (c.hole
    ? { x: c.x, y: c.y - c.ry + 12 + a.cfg.eye * backScale(a) }
    : { x, y: c.top - 14 + a.cfg.eye * backScale(a) });
  const coverX = (c) => (c.hole ? c.x : c.x + rand(-c.w, c.w) * 0.3);

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
    const d = Math.hypot(x - a.x, (y - a.y) * 1.6);
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

  // Neues Exemplar einer Tierart erzeugen
  function spawn(cfg) {
    const el = document.createElementNS(SVGNS, 'g');
    el.setAttribute('class', 'animal ' + cfg.kind);
    el.setAttribute('aria-label', cfg.name);
    el.innerHTML = cfg.art;
    const a = {
      cfg, el, s: S * (cfg.s || 1),
      x: 0, y: 2000, dir: Math.random() < 0.5 ? -1 : 1, bob: 0, phase: Math.random() * 6, tilt: 0,
      layer: 'back', mode: 'hidden', cover: null, steps: [], cur: null,
    };
    animals.push(a);
    return a;
  }
  function despawn(a) {
    a.el.remove();
    animals = animals.filter((x) => x !== a);
  }

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
    placeHidden(a); // zufälliges Versteck
    a.mode = 'peek';
    const c = a.cover;
    const peek = peekPos(a, c, a.x);
    const steps = [
      move(peek.x, peek.y, 1.4, { ease: 'out' }),
      wait(rand(0.8, 1.8), true),
      call(() => { a.mode = 'out'; a.el.classList.add('out'); discover(a.cfg); }),
    ];
    if (flies(a)) {
      const exit = c.hole ? { x: c.x, y: peek.y } : { x: peek.x, y: c.top - 8 };
      if (!c.hole) steps.push(move(exit.x, exit.y, 0.35, { ease: 'out' }));
      const t = pickSpot(a);
      steps.push(layer('front'), flyTo(a, exit, t.x, t.y), call(() => roam(a)));
    } else {
      const v = viewRange();
      const [l0, l1] = lane();
      const tx = clamp(peek.x + (Math.random() < 0.5 ? -1 : 1) * rand(60, 160), v.min + 70, v.max - 70);
      steps.push(
        move(peek.x, c.top - 6, 0.35, { ease: 'out' }), // hochspringen
        layer('front'),
        move(tx, rand(l0, l0 + (l1 - l0) * 0.5), 0.55, { ease: 'in' }), // nach vorn
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
    if (area && (!perches.length || Math.random() < (a.cfg.kind === 'swim' ? 0.85 : 0.45))) {
      const top = Math.min(area.y1, Math.max(area.y0, 150 + a.cfg.h * a.s)); // nicht über die Anzeige oben
      return { x: rand(Math.max(area.x0, v.min + 70), Math.min(area.x1, v.max - 70)), y: rand(top, area.y1) };
    }
    return perches.length ? pick(perches) : { x: (v.min + v.max) / 2, y: 300 };
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
    const [l0, l1] = lane();
    plan(a, [wait(rand(0.8, 4), Math.random() < 0.6), walkTo(a, rand(v.min + 80, v.max - 80), rand(l0, l1)), call(() => roam(a))]);
  }

  // Flucht ins nächste Versteck; danach verschwindet das Exemplar
  function flee(a) {
    if (a.mode === 'hidden' || a.mode === 'flee') return;
    a.el.classList.remove('out');
    a.mode = 'flee';
    const gone = call(() => despawn(a));
    if (a.layer !== 'front') {
      // war noch beim Hervorlugen: einfach wieder abtauchen
      const h = hiddenPos(a, a.cover, a.x);
      plan(a, [move(h.x, h.y, 0.3, { ease: 'in' }), gone]);
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
      steps = [
        walkTo(a, x, lane()[0] + 6, 2.6),
        move(x, c.top - 6, 0.3, { ease: 'out' }), // hineinspringen
        layer('back'),
      ];
    }
    steps.push(move(h.x, h.y, 0.3, { ease: 'in' }), gone);
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
    for (const a of animals.slice()) {
      updateAnimal(a, dt);
      if (!a.el.isConnected) continue;
      const sc = scaleOf(a);
      a.el.setAttribute('transform',
        `translate(${a.x.toFixed(1)} ${(a.y + a.bob).toFixed(1)}) rotate(${a.tilt.toFixed(1)}) scale(${(sc * a.dir).toFixed(3)} ${sc.toFixed(3)})`);
    }
    // weiter unten im Bild = weiter vorne; Flieger in der Luft immer davor
    const front = animals.filter((a) => a.layer === 'front')
      .sort((p, q) => (flies(p) ? 2000 : 0) + p.y - ((flies(q) ? 2000 : 0) + q.y));
    const key = front.map((a) => a.y.toFixed(0)).join();
    if (key !== zOrder) {
      zOrder = key;
      const kids = layers.front.children;
      front.forEach((a, i) => { if (kids[i] !== a.el) layers.front.insertBefore(a.el, kids[i] || null); });
    }
  }

  // --- Spiel-Logik ---
  function render() {
    state.visible = outStack.length;
    els.starCount.textContent = stars.count;
  }

  // Zufällige Tierart; seltene Tiere (w < 1) kommen seltener
  function pickSpecies() {
    const list = scene.animals;
    let sum = 0;
    for (const a of list) sum += a.w ?? 1;
    let r = Math.random() * sum;
    for (const a of list) { r -= a.w ?? 1; if (r <= 0) return a; }
    return list[list.length - 1];
  }

  function showNext() {
    if (outStack.length >= settings.max) return;
    const a = spawn(pickSpecies());
    outStack.push(a);
    emerge(a);
    render();
    if (outStack.length >= settings.max && !state.celebrated) celebrate();
  }

  function startle() {
    if (!outStack.length) return;
    const n = settings.mode === 'all' ? outStack.length
      : settings.mode === 'some' ? Math.max(1, Math.ceil(outStack.length / 3)) : 1;
    outStack.splice(outStack.length - n).forEach(flee);
    state.celebrated = false;
    render();
    toast('Huch! Zu laut! 🙉');
  }

  // Volle Karte: still ein paar Sterne regnen lassen (kein Text)
  function celebrate() {
    state.celebrated = true;
    stars.count++; store.set('stars', stars); render();
    if (reduceMotion) return;
    for (let i = 0; i < 22; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.textContent = ['⭐', '✨', '🌟'][i % 3];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.top = '0';
      s.style.animationDelay = Math.random() * 1.2 + 's';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 4200);
    }
  }

  function reset() {
    state.quietFor = 0; state.loudFor = 0; state.celebrated = false;
    animals.slice().forEach(despawn);
    outStack = [];
    render();
  }

  let toastTimer;
  function toast(msg, ms = 1600) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), ms);
  }

  // ---------- Sammelalbum ----------
  function discover(cfg) {
    const book = album[scene.id] || (album[scene.id] = {});
    if (!book[cfg.id]) { albumNew = true; store.set('albumNew', true); markAlbum(); }
    book[cfg.id] = (book[cfg.id] || 0) + 1;
    store.set('album', album);
  }
  function markAlbum() { $('#btn-settings').classList.toggle('has-new', albumNew); $('#btn-album').classList.toggle('has-new', albumNew); }

  let albumScene = null;
  function openAlbum() {
    if (els.dialog.open) els.dialog.close();
    albumScene = albumScene || (scene && scene.id) || SCENES[0].id;
    els.albumDlg.showModal();
    renderAlbum();
    albumNew = false; store.set('albumNew', false); markAlbum();
  }
  function renderAlbum() {
    els.albumTabs.replaceChildren();
    let total = 0, found = 0;
    for (const sc of SCENES) {
      const book = album[sc.id] || {};
      const n = sc.animals.filter((a) => book[a.id]).length;
      total += sc.animals.length; found += n;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'album-tab';
      b.setAttribute('aria-pressed', String(sc.id === albumScene));
      b.innerHTML = `<span class="ic">${sc.icon}</span><span class="nm">${sc.name}</span><span class="ct">${n}/${sc.animals.length}</span>`;
      b.addEventListener('click', () => { albumScene = sc.id; renderAlbum(); });
      els.albumTabs.appendChild(b);
    }
    const sc = SCENES.find((s) => s.id === albumScene);
    const book = album[sc.id] || {};
    els.albumCount.textContent = `${found} von ${total} entdeckt`;
    els.albumGrid.replaceChildren();
    for (const a of sc.animals) {
      const n = book[a.id] || 0;
      const card = document.createElement('div');
      card.className = 'album-card' + (n ? '' : ' unknown');
      const pic = document.createElementNS(SVGNS, 'svg');
      pic.setAttribute('class', 'pic'); pic.setAttribute('role', 'img');
      pic.setAttribute('aria-label', n ? a.name : 'noch nicht entdeckt');
      pic.innerHTML = `<g>${a.art}</g>`;
      card.appendChild(pic);
      const name = document.createElement('div');
      name.className = 'nm';
      name.textContent = n ? a.name : '???';
      card.appendChild(name);
      if (n) { const c = document.createElement('div'); c.className = 'ct'; c.textContent = '× ' + n; card.appendChild(c); }
      els.albumGrid.appendChild(card);
      const bb = pic.firstChild.getBBox();
      const m = Math.max(bb.width, bb.height) * 0.06;
      pic.setAttribute('viewBox', `${bb.x - m} ${bb.y - m} ${bb.width + 2 * m} ${bb.height + 2 * m}`);
    }
  }

  // ---------- Hauptschleife ----------
  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;

    if (state.running) {
      // Mikrofon läuft immer weiter; in der Pause zählt der Wert nur nicht (Balken sinkt ab)
      const raw = state.paused ? (readLevel(dt), 0) : readLevel(dt);
      // schnell hoch, langsam runter
      const k = raw > state.level ? 0.35 : 0.08;
      state.level += (raw - state.level) * k;

      if (state.calibrating) state.calibrating.push(raw);

      const loud = !state.paused && state.level > settings.threshold;
      // Anzeige etwas ruhiger als die Erkennung: zügig steigen, sanft fallen
      const tau = state.level > state.shown ? 0.2 : 0.6;
      state.shown += (state.level - state.shown) * (1 - Math.exp(-dt / tau));
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
          if (state.visible < settings.max) {
            state.quietFor += dt;
            if (state.quietFor >= settings.step) { state.quietFor = 0; showNext(); }
          }
        }
        const frac = state.visible >= settings.max ? 1 : state.quietFor / settings.step;
        els.ring.style.strokeDashoffset = RING_LEN * (1 - frac);
      }
    }
    updateAnimals(dt); // auch in der Pause bewegen sich die Tiere weiter
    requestAnimationFrame(tick);
  }

  function updateMeter(loud) {
    els.fill.style.width = state.shown.toFixed(1) + '%';
    const over = state.shown > settings.threshold;
    els.meter.classList.toggle('over', over);
    els.meter.classList.toggle('near', !over && state.shown > settings.threshold * 0.8);
    // Stimmungsfigur bleibt nach Lärm noch kurz erschrocken (kein Flackern)
    const now = performance.now();
    if (loud) state.moodUntil = now + 1200;
    if (mood) mood.classList.toggle('loud', now < (state.moodUntil || 0));
  }

  function applySettings() {
    els.mark.style.left = settings.threshold + '%';
    els.threshold.value = settings.threshold;
    els.step.value = String(settings.step);
    els.mode.value = settings.mode;
    els.max.value = String(settings.max);
    els.hidehud.checked = settings.hidehud;
    els.random.checked = settings.random;
    els.awake.checked = settings.awake;
    document.body.classList.toggle('hidehud', settings.hidehud);
  }

  // ---------- Bildschirm wach halten ----------
  let wakeLock = null;
  const wakeSupported = 'wakeLock' in navigator;
  async function updateWakeLock() {
    const want = settings.awake && state.running && document.visibilityState === 'visible';
    if (!wakeSupported) {
      els.awakeStatus.hidden = !settings.awake;
      els.awakeStatus.textContent = 'Dieser Browser kann das leider nicht. Bitte in den Geräte-Einstellungen die automatische Bildschirmsperre ausschalten (iPad: Anzeige & Helligkeit → Automatische Sperre → Nie).';
      return;
    }
    try {
      if (want && !wakeLock) {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => { wakeLock = null; showAwake(); });
      } else if (!want && wakeLock) {
        await wakeLock.release();
        wakeLock = null;
      }
    } catch { wakeLock = null; }
    showAwake();
  }
  function showAwake() {
    if (!wakeSupported) return;
    els.awakeStatus.hidden = !settings.awake || !state.running;
    els.awakeStatus.textContent = wakeLock ? '✅ Der Bildschirm bleibt an.' : '⚠️ Gerade nicht möglich (z. B. Energiesparmodus). Wird beim nächsten Antippen erneut versucht.';
  }
  document.addEventListener('visibilitychange', updateWakeLock);
  document.addEventListener('pointerdown', () => { if (settings.awake && state.running && !wakeLock) updateWakeLock(); });

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
    const wasRunning = state.running;
    state.running = true;
    els.start.hidden = true;
    if (state.paused) togglePause();
    const changed = !scene || scene.id !== chosen;
    useScene(chosen);
    if (!wasRunning || changed) reset();
    updateWakeLock();
    if (state.demo && !wasRunning) toast('Vorschau: Taste L gedrückt halten = laut', 3000);
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
    $('#btn-pause').textContent = state.paused ? '▶' : '⏸';
    document.body.classList.toggle('is-paused', state.paused);
    // Das Mikrofon läuft in der Pause weiter (Anhalten und Fortsetzen ist in manchen Browsern unzuverlässig)
    if (!state.paused) checkMic();
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
  $('#btn-album').addEventListener('click', openAlbum);
  $('#album-close').addEventListener('click', () => els.albumDlg.close());

  els.threshold.addEventListener('input', () => { settings.threshold = +els.threshold.value; saveSettings(); applySettings(); });
  els.step.addEventListener('change', () => { settings.step = +els.step.value; saveSettings(); });
  els.mode.addEventListener('change', () => { settings.mode = els.mode.value; store.set('modeChosen', true); saveSettings(); });
  els.max.addEventListener('change', () => { settings.max = +els.max.value; saveSettings(); });
  els.hidehud.addEventListener('change', () => { settings.hidehud = els.hidehud.checked; saveSettings(); applySettings(); });
  els.random.addEventListener('change', () => { settings.random = els.random.checked; saveSettings(); });
  els.awake.addEventListener('change', () => { settings.awake = els.awake.checked; saveSettings(); updateWakeLock(); });
  els.scene.addEventListener('change', () => { chosen = els.scene.value; useScene(chosen); });

  document.addEventListener('keydown', (e) => {
    if (els.dialog.open || els.albumDlg.open || e.target.closest('input, select')) return;
    switch (e.key.toLowerCase()) {
      case ' ': e.preventDefault(); togglePause(); break;
      case 'r': reset(); break;
      case 'f': toggleFullscreen(); break;
      case 'e': els.dialog.showModal(); break;
      case 'a': openAlbum(); break;
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
    idleTimer = setTimeout(() => { if (state.running && !els.dialog.open && !els.albumDlg.open) document.body.classList.add('idle'); }, 4000);
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
    state, settings, showNext, startle, reset, loadScene, openAlbum, album,
    get animals() { return animals; }, get scene() { return scene; },
    get audio() { return { ctx: audioCtx, stream }; },
  };

  applySettings();
  markAlbum();
  loadScene(settings.scene);
  requestAnimationFrame(tick);
})();
