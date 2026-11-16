/* Bereich: Dschungel */
(() => {
  const { c, e, p, s, g, r, eyes, eye, cheeks, face, flower } = FW;

  const leaf = (x, y, len, ang, col) => e(x, y, len, len * 0.32, col, FW.rot(ang, x, y));
  const vine = (x, h, cls) => g(s(`M${x} 0 Q${x + 24} ${h * 0.4} ${x - 10} ${h * 0.7} Q${x - 24} ${h * 0.9} ${x} ${h}`, '#3a7a2a', 7)
    + leaf(x + 8, h * 0.3, 18, 30, '#4a9a3a') + leaf(x - 12, h * 0.6, 18, -30, '#4a9a3a') + leaf(x, h * 0.9, 16, 20, '#4a9a3a'), `class="${cls}"`);

  const back = `
  <defs>
    <linearGradient id="dsch-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fe0c8"/><stop offset="1" stop-color="#e6f8d8"/></linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#dsch-sky)"/>
  <g id="mood" transform="translate(220 160)">
    <g class="pulse">${c(0, 0, 100, '#fff2a0', 'opacity=".45"')}</g>
    ${c(0, 0, 70, '#ffd23f')}${face(70)}
  </g>
  <!-- Hintergrund-Bäume -->
  ${r(420, 120, 70, 600, 20, '#6a8a5a', 'opacity=".5"')}${r(1060, 100, 80, 620, 20, '#6a8a5a', 'opacity=".5"')}
  ${c(450, 140, 140, '#5aa060', 'opacity=".55"')}${c(1100, 120, 160, '#5aa060', 'opacity=".55"')}${c(800, 80, 130, '#5aa060', 'opacity=".45"')}
  <path d="M0 620 Q300 560 640 610 T1300 590 T1600 600 V900 H0Z" fill="#6cbf5a"/>
  <!-- großer Baum mit Ast -->
  ${p('M1290 740 Q1300 500 1286 200 L1380 200 Q1372 500 1392 740Z', '#7a5a3a')}
  ${s('M1300 380 Q1200 360 1120 380', '#7a5a3a', 22)}${s('M1370 300 Q1480 280 1560 300', '#7a5a3a', 20)}
  ${c(1330, 150, 120, '#3a9a4a')}${c(1460, 190, 100, '#3a9a4a')}${c(1200, 190, 90, '#45a855')}
  ${vine(700, 300, 'sway')}${vine(960, 220, 'sway d2')}${vine(1140, 390, 'sway')}${vine(1520, 300, 'sway d2')}
  ${flower(1140, 380, '#ff5a8a', 10)}${flower(1530, 300, '#ffb02a', 9)}`;

  const bigLeaves = (x, y, k, col1, col2) => [[-60, 0, 110, -150], [-30, -20, 120, -120], [0, -30, 130, -90], [30, -20, 120, -60], [60, 0, 110, -30]]
    .map(([dx, dy, len, ang], i) => leaf(x + dx * k + Math.cos(ang * Math.PI / 180) * len * k * 0.6, y + dy * k + Math.sin(ang * Math.PI / 180) * len * k * 0.6, len * k * 0.6, ang, i % 2 ? col1 : col2)).join('');

  const front = `
  <rect y="700" width="1600" height="200" fill="#5aae4a"/>
  <rect y="700" width="1600" height="12" fill="#4a9a3a"/>
  <!-- große Blätter links -->
  ${g(bigLeaves(230, 770, 1.7, '#2f8a3f', '#3fa04f'), 'class="sway"')}
  <!-- Farn -->
  ${g(bigLeaves(560, 760, 1.15, '#4aa84a', '#5ab85a'), 'class="sway d2"')}
  <!-- Felsen mit Wasserfall -->
  ${p('M770 770 Q770 600 880 580 Q1000 576 1040 640 L1050 770Z', '#8a9488')}${r(880, 584, 50, 186, 10, '#8ad8f8', 'opacity=".9"')}
  ${s('M890 600 V760 M910 610 V760', '#d8f4ff', 4, 'class="twinkle"')}${e(905, 772, 60, 12, '#8ad8f8')}
  <!-- Wurzel -->
  ${p('M1140 770 Q1150 660 1220 650 Q1290 660 1300 770Z', '#7a5a3a')}${s('M1160 770 Q1180 700 1220 690 M1280 770 Q1270 710 1236 694', '#5a3a2a', 8)}
  <!-- Blätterbusch rechts -->
  ${g(bigLeaves(1480, 770, 1.8, '#2f8a3f', '#3fa04f'), 'class="sway d2"')}
  ${flower(380, 840, '#ff5a8a', 9)}${flower(1070, 860, '#ffb02a', 8)}`;

  const monkey = `
  <g class="tail">${s('M30 -30 Q90 -30 80 -90 Q74 -116 56 -104', '#8a5a34', 9)}</g>
  ${r(-30, -24, 16, 26, 7, '#8a5a34')}${r(14, -24, 16, 26, 7, '#8a5a34')}
  ${e(0, -46, 36, 34, '#9a6a3e')}${e(0, -42, 20, 22, '#e8c49a')}
  ${c(-40, -104, 16, '#9a6a3e')}${c(40, -104, 16, '#9a6a3e')}${c(-40, -104, 9, '#e8c49a')}${c(40, -104, 9, '#e8c49a')}
  ${c(0, -104, 38, '#9a6a3e')}
  ${p('M-26 -112 Q-26 -130 -10 -128 Q0 -120 10 -128 Q26 -130 26 -112 Q30 -84 0 -78 Q-30 -84 -26 -112Z', '#f0d0a8')}
  ${eyes(-11, 11, -112, 5)}${c(-4, -100, 2, '#7a4a2a')}${c(4, -100, 2, '#7a4a2a')}
  ${s('M-10 -92 Q0 -84 10 -92', '#7a4a2a', 3)}${cheeks(-20, 20, -96, 6, '#f2a07a')}`;

  const toucan = `
  ${p('M-26 -24 L-52 0 L-20 -14Z', '#1a1a20')}
  <g class="wing wl">${p('M-6 -50 C-30 -86 -60 -84 -66 -70 C-44 -66 -30 -56 -16 -40Z', '#2a2a32')}</g>
  <g class="wing wr">${p('M6 -50 C30 -86 60 -84 66 -70 C44 -66 30 -56 16 -40Z', '#2a2a32')}</g>
  ${e(0, -40, 28, 34, '#22222a')}${e(6, -50, 16, 16, '#fff2c0')}
  ${c(8, -74, 20, '#22222a')}${e(12, -72, 12, 13, '#fff2c0')}
  ${p('M24 -86 Q80 -94 86 -72 Q70 -60 24 -62Z', '#ff9a1a')}${p('M70 -90 Q86 -86 86 -72 Q78 -78 70 -78Z', '#e8302a')}${s('M28 -74 Q60 -74 84 -74', '#c86a10', 2)}
  ${c(12, -76, 7, '#5ad0f0')}${eye(12, -76, 4)}
  ${s('M-6 -8 L-6 0 M6 -8 L6 0', '#5a8ad8', 3)}`;

  const sloth = `
  ${e(0, -50, 44, 46, '#b49a7a')}${e(0, -44, 26, 28, '#cdb898')}
  ${s('M-36 -60 Q-60 -40 -56 -10 M36 -60 Q60 -40 56 -10', '#a48a6a', 14)}${s('M-60 -12 l-4 10 M-54 -10 l0 10 M60 -12 l4 10 M54 -10 l0 10', '#5a4a3a', 3)}
  ${r(-28, -16, 16, 18, 7, '#a48a6a')}${r(12, -16, 16, 18, 7, '#a48a6a')}
  ${c(0, -108, 38, '#b49a7a')}${e(0, -104, 30, 24, '#f0e2c8')}
  ${e(-14, -106, 12, 8, '#5a4030', FW.rot(-20, -14, -106))}${e(14, -106, 12, 8, '#5a4030', FW.rot(20, 14, -106))}
  ${eyes(-13, 13, -106, 4)}${e(0, -96, 6, 4, '#3a2a1a')}${s('M-8 -88 Q0 -82 8 -88', '#5a4030', 2.5)}`;

  const tiger = `
  <g class="tail">${s('M40 -30 Q100 -30 100 -84', '#f08a2a', 10)}${s('M70 -32 v-10 M90 -46 h-10 M98 -66 h-10', '#2b2b2b', 5)}</g>
  ${r(-38, -26, 18, 28, 8, '#f08a2a')}${r(20, -26, 18, 28, 8, '#f08a2a')}
  ${e(0, -46, 50, 38, '#f49a3a')}${e(0, -38, 26, 24, '#fff4e0')}
  ${s('M-40 -66 l10 14 M-46 -46 l12 6 M40 -66 l-10 14 M46 -46 l-12 6', '#2b2b2b', 6)}
  ${c(-32, -138, 14, '#f49a3a')}${c(32, -138, 14, '#f49a3a')}${c(-32, -138, 7, '#fff4e0')}${c(32, -138, 7, '#fff4e0')}
  ${c(0, -104, 42, '#f49a3a')}
  ${s('M0 -146 v14 M-12 -142 l4 12 M12 -142 l-4 12 M-40 -110 h14 M-40 -96 h12 M40 -110 h-14 M40 -96 h-12', '#2b2b2b', 5)}
  ${e(-14, -84, 16, 12, '#fff4e0')}${e(14, -84, 16, 12, '#fff4e0')}${p('M-7 -94 L7 -94 L0 -86Z', '#e07a8a')}
  ${eyes(-15, 15, -110, 5.5)}`;

  const snake = `
  ${s('M-80 -10 Q-60 -40 -30 -12 Q0 14 30 -14 Q46 -30 50 -54', '#5ac85a', 22)}
  ${s('M-60 -24 l6 6 M-20 -6 l6 6 M14 -6 l6 -6', '#ffd23f', 5)}
  ${e(60, -66, 26, 20, '#5ac85a')}${eyes(56, 72, -72, 5)}
  ${s('M82 -62 l12 2 l6 -5 M94 -60 l6 5', '#e8302a', 2.5)}${cheeks(52, 76, -58, 5, '#ff9e7a')}`;

  const chameleon = `
  <g class="tail">${s('M-40 -30 Q-80 -30 -76 -8 Q-70 6 -58 -2 Q-56 -12 -64 -12', '#4ac0a0', 9)}</g>
  ${s('M-24 -20 L-30 0 M16 -20 L20 0', '#3aa890', 7)}
  ${p('M-44 -30 Q-40 -76 10 -76 Q50 -74 54 -40 Q50 -16 10 -16 Q-40 -16 -44 -30Z', '#4ac0a0')}
  ${p('M-30 -70 Q-10 -90 14 -76', 'none', 'stroke="#3aa890" stroke-width="6"')}
  ${s('M-20 -40 Q0 -50 20 -40', '#ffd23f', 5, 'opacity=".8"')}
  ${p('M30 -66 Q70 -80 80 -50 Q76 -30 46 -34Z', '#5ad0b0')}
  ${c(56, -54, 14, '#5ad0b0', 'stroke="#3aa890" stroke-width="3"')}${eye(58, -54, 5)}
  ${s('M64 -38 Q72 -36 78 -42', '#2a7a6a', 2.5)}`;

  // ---- weitere Tiere ----
  const extra = (() => {
    const { c, e, p, s, r, eyes, eye, cheeks } = FW;
    const gorilla = `
    ${s('M-50 -90 Q-74 -50 -60 -6 M50 -90 Q74 -50 60 -6', '#3a3a40', 22)}
    ${e(-20, -6, 18, 9, '#2a2a30')}${e(20, -6, 18, 9, '#2a2a30')}
    ${e(0, -70, 56, 62, '#44444c')}${e(0, -60, 30, 34, '#6a6a74')}
    ${c(0, -146, 40, '#44444c')}${e(0, -140, 28, 26, '#7a7a84')}
    ${e(0, -128, 16, 10, '#5a5a64')}${c(-5, -130, 2.5, '#2a2a30')}${c(5, -130, 2.5, '#2a2a30')}
    ${eyes(-12, 12, -150, 4.5)}${s('M-8 -118 Q0 -114 8 -118', '#2a2a30', 2.5)}`;
    const hummingbird = `
    ${p('M-20 -30 L-40 -24 L-18 -24Z', '#2a8a6a')}
    <g class="wings2">${e(-10, -56, 10, 24, '#9ae0d0', FW.rot(-30, -10, -56) + ' opacity=".8"')}${e(10, -56, 10, 24, '#9ae0d0', FW.rot(30, 10, -56) + ' opacity=".8"')}</g>
    ${e(0, -36, 18, 14, '#2ab08a')}${e(4, -30, 10, 8, '#e8f8f0')}
    ${c(16, -50, 12, '#2ab08a')}${e(16, -42, 6, 4, '#e8302a')}${p('M26 -52 L60 -50 L26 -48Z', '#2b2b2b')}${eye(18, -54, 3)}`;
    const recolor = (art, map) => Object.entries(map).reduce((a, [from, to]) => a.split(from).join(to), art);
    const dartFrog = recolor(FW.art.frosch, { '#5ab84a': '#2a7af0', '#4aa23a': '#1a5ad0', '#c8e8a0': '#ffd23f', '#2a6a1a': '#0a2a6a' });
    const blueButterfly = recolor(FW.art.schmetterling, { '#ff8ac4': '#2a8af0', '#ffb04a': '#5ad8f0' });
    return [
      { id: 'gorilla', name: 'Gorilla', icon: '🦍', kind: 'walk', h: 190, eye: 150, speed: 110, hop: 8, freq: 2, art: gorilla, big: true, w: 0.6 },
      { id: 'kolibri', name: 'Kolibri', icon: '🐦', kind: 'fly', h: 70, eye: 54, speed: 380, art: hummingbird, s: 1.1 },
      { id: 'pfeilgiftfrosch', name: 'Pfeilgiftfrosch', icon: '🐸', kind: 'walk', h: 92, eye: 72, speed: 180, hop: 40, freq: 2, art: dartFrog },
      { id: 'morphofalter', name: 'Blauer Falter', icon: '🦋', kind: 'fly', h: 104, eye: 78, speed: 160, art: blueButterfly, s: 1.1 },
    ];
  })();

  FW.scene({
    id: 'dschungel', name: 'Dschungel', icon: '🐒', bg: '#9fe0c8',
    back, front,
    under: '#5aae4a',
    ground: 700, lane: [760, 808],
    covers: [
      { x: 230, top: 580, w: 200, big: true },
      { x: 560, top: 640, w: 140 },
      { x: 910, top: 590, w: 220, big: true },
      { x: 1220, top: 656, w: 120 },
      { x: 1480, top: 570, w: 220, big: true },
    ],
    perches: [
      { x: 1160, y: 372 }, { x: 1220, y: 366 }, { x: 1500, y: 290 }, { x: 1440, y: 284 }, { x: 900, y: 584 },
      { x: 1330, y: 40 }, { x: 960, y: 220 }, { x: 700, y: 300 },
    ],
    animals: [
      { id: 'affe', name: 'Affe', icon: '🐒', kind: 'walk', h: 150, eye: 112, speed: 190, hop: 24, freq: 2.8, art: monkey },
      { id: 'tukan', name: 'Tukan', icon: '🐦', kind: 'fly', h: 96, eye: 76, speed: 320, art: toucan },
      { id: 'faultier', name: 'Faultier', icon: '🦥', kind: 'walk', h: 148, eye: 106, speed: 28, hop: 2, freq: 1, tilt: 3, art: sloth },
      { id: 'tiger', name: 'Tiger', icon: '🐯', kind: 'walk', h: 154, eye: 110, speed: 150, hop: 5, freq: 3, art: tiger },
      { id: 'schlange', name: 'Schlange', icon: '🐍', kind: 'walk', h: 88, eye: 72, speed: 110, hop: 2, freq: 3, tilt: 6, art: snake },
      { id: 'chamaeleon', name: 'Chamäleon', icon: '🦎', kind: 'walk', h: 82, eye: 54, speed: 60, hop: 2, freq: 2, art: chameleon },
      ...extra,
    ],
  });
})();
