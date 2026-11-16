/* Bereich: Weltall (auf dem Mond) */
(() => {
  const { c, e, p, s, g, r, eyes, eye, cheeks, face } = FW;

  const stars = [...Array(30)].map((_, i) => c((i * 211 + 40) % 1600, (i * 97 + 20) % 520, 2 + (i % 3) * 1.5, '#fff8d8',
    `class="twinkle ${['', 'd2', 'd3'][i % 3]}"`)).join('');

  // Stimmungsfigur: Saturn mit Ring
  const mood = `
  <g id="mood" transform="translate(220 170)">
    ${e(0, 6, 120, 26, 'none', 'stroke="#e8c48a" stroke-width="12"')}
    ${c(0, 0, 66, '#f4b860')}${s('M-60 -20 Q0 -34 60 -20 M-64 14 Q0 2 64 14', '#e09a40', 8, 'opacity=".6"')}
    <g transform="translate(0 -16)">${face(60, { ink: '#6a3a10' })}</g>
    ${p('M-120 6 A120 26 0 0 0 120 6', 'none', 'stroke="#e8c48a" stroke-width="12"')}
  </g>`;

  const back = `
  <defs>
    <linearGradient id="all-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0f2e"/><stop offset="1" stop-color="#2e2466"/></linearGradient>
    <radialGradient id="all-flame"><stop offset="0" stop-color="#fff6a0"/><stop offset=".6" stop-color="#ffa030"/><stop offset="1" stop-color="#ff5a2a" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#all-sky)"/>
  ${stars}
  ${mood}
  <!-- Erde und roter Planet -->
  ${c(1300, 150, 70, '#3a8ad8')}${p('M1260 110 Q1290 96 1300 120 Q1280 150 1250 140Z M1310 170 Q1350 150 1360 180 Q1330 210 1300 196Z', '#5ac85a')}${e(1290, 100, 30, 8, '#fff', 'opacity=".7"')}
  ${c(860, 110, 30, '#e0603a')}${c(850, 100, 7, '#c04a2a')}${c(872, 122, 5, '#c04a2a')}
  <!-- Sternschnuppe -->
  ${s('M560 60 L680 100', '#fff', 3, 'class="twinkle" opacity=".7"')}${c(684, 102, 5, '#fff8d8', 'class="twinkle"')}
  <!-- Mondhügel hinten -->
  <path d="M0 620 Q300 540 640 600 T1300 580 T1600 590 V900 H0Z" fill="#8a8aa6"/>
  ${e(400, 600, 50, 10, '#7a7a96')}${e(1180, 596, 40, 8, '#7a7a96')}`;

  const crater = (x, y, w, h) => e(x, y, w, h, '#a4a4b8') + e(x, y + h * 0.15, w * 0.8, h * 0.6, '#8a8aa0');

  const front = `
  <rect y="700" width="1600" height="200" fill="#c4c4d4"/>
  <rect y="700" width="1600" height="12" fill="#b4b4c6"/>
  ${crater(140, 820, 60, 14)}${crater(720, 860, 80, 16)}${crater(1100, 830, 50, 12)}${crater(1450, 870, 70, 14)}
  <!-- Kraterrand -->
  ${p('M130 760 Q150 650 250 640 Q350 650 370 760Z', '#b0b0c4')}${e(250, 650, 80, 14, '#9a9ab0')}
  <!-- Mondfelsen -->
  ${p('M470 760 Q470 640 540 604 Q620 590 660 650 Q680 700 670 760Z', '#9a9ab4')}${c(560, 650, 12, '#8a8aa4')}${c(610, 690, 9, '#8a8aa4')}
  <!-- Mondstation -->
  ${r(800, 700, 240, 60, 10, '#dcdce8')}${p('M820 704 A100 140 0 0 1 1020 704Z', '#e8eef8', 'stroke="#a4b0c4" stroke-width="4"')}
  ${c(890, 640, 18, '#7ad0f8')}${c(960, 640, 18, '#7ad0f8')}${r(905, 680, 30, 30, 4, '#8a94a8')}
  ${s('M920 566 V530', '#a4b0c4', 5)}${c(920, 526, 9, '#ff5a5a', 'class="twinkle"')}
  ${r(1060, 640, 10, 110, 3, '#c0c0d0')}${p('M1070 640 L1130 656 L1070 672Z', '#ff5a5a')}
  <!-- Felsen -->
  ${p('M1130 760 Q1140 670 1210 650 Q1280 670 1290 760Z', '#a4a4bc')}
  <!-- großer Felsen rechts -->
  ${p('M1340 760 Q1340 600 1450 560 Q1560 560 1600 620 L1600 760Z', '#9a9ab4')}${c(1440, 640, 16, '#8a8aa4')}${c(1520, 600, 10, '#8a8aa4')}`;

  const helmet = (cy, rr) => c(0, cy, rr, '#cfefff', `opacity=".35" stroke="#e8f6ff" stroke-width="5"`) + e(-rr * 0.4, cy - rr * 0.5, rr * 0.25, rr * 0.14, '#fff', `opacity=".8" ${FW.rot(-30, -rr * 0.4, cy - rr * 0.5)}`);
  const suit = (col) => `${r(-30, -24, 18, 26, 8, col)}${r(12, -24, 18, 26, 8, col)}${r(-46, -86, 18, 46, 8, '#b8c0d0')}
    ${r(-36, -84, 72, 66, 22, col)}${r(-14, -66, 28, 18, 4, '#5a8ad8')}${c(-6, -57, 3, '#ff5a5a')}${c(6, -57, 3, '#5aff8a')}`;

  const astroCat = `
  ${suit('#f4f6fa')}
  ${p('M-26 -134 L-22 -158 L-6 -140Z', '#f0a04a')}${p('M26 -134 L22 -158 L6 -140Z', '#f0a04a')}
  ${c(0, -118, 30, '#f0a04a')}${e(0, -106, 13, 9, '#fbe3c4')}${p('M-4 -112 L4 -112 L0 -106Z', '#e07a8a')}
  ${eyes(-11, 11, -122, 4.5)}${s('M-10 -106 L-28 -110 M10 -106 L28 -110', '#7a5a3c', 1.5)}
  ${helmet(-118, 46)}`;

  const astroDog = `
  ${suit('#f4f6fa')}
  ${e(-30, -112, 12, 24, '#8a5a34', FW.rot(15, -30, -112))}${e(30, -112, 12, 24, '#8a5a34', FW.rot(-15, 30, -112))}
  ${c(0, -118, 30, '#c08a5a')}${e(0, -104, 16, 12, '#f0dcc0')}${e(0, -110, 7, 5, '#2b1d14')}
  ${eyes(-11, 11, -124, 4.5)}${p('M-4 -98 Q0 -88 4 -98Z', '#ff8aa0')}
  ${helmet(-118, 46)}`;

  const alien = `
  ${e(-20, -4, 14, 8, '#5ac85a')}${e(20, -4, 14, 8, '#5ac85a')}
  ${s('M-16 -96 Q-30 -130 -34 -140 M16 -96 Q30 -130 34 -140', '#5ac85a', 5)}${c(-34, -142, 8, '#ffd23f', 'class="glow"')}${c(34, -142, 8, '#ffd23f', 'class="glow"')}
  ${p('M-40 -10 Q-46 -100 0 -104 Q46 -100 40 -10Z', '#6ad86a')}
  ${c(-16, -70, 12, '#fff')}${c(16, -70, 12, '#fff')}${c(0, -86, 10, '#fff')}${eyes(-15, 17, -70, 6)}${eye(1, -86, 5)}
  ${s('M-14 -46 Q0 -34 14 -46', '#2a7a2a', 4)}${cheeks(-26, 26, -50, 6, '#ff9ec4')}`;

  const robot = `
  <g class="legs">${r(-28, -30, 16, 30, 4, '#8a94a8')}${r(12, -30, 16, 30, 4, '#8a94a8')}</g>
  ${r(-34, -6, 26, 8, 3, '#5a6478')}${r(8, -6, 26, 8, 3, '#5a6478')}
  ${r(-60, -84, 16, 44, 8, '#9aa4b8')}${r(44, -84, 16, 44, 8, '#9aa4b8')}
  ${r(-42, -92, 84, 66, 12, '#b8c4d8')}${r(-26, -78, 52, 30, 6, '#5a6478')}
  ${c(-14, -63, 5, '#ffd23f', 'class="twinkle"')}${c(0, -63, 5, '#5aff8a', 'class="twinkle d2"')}${c(14, -63, 5, '#ff5a5a', 'class="twinkle d3"')}
  ${r(-8, -100, 16, 10, 2, '#8a94a8')}
  ${r(-34, -150, 68, 52, 14, '#c8d4e8')}
  ${s('M0 -150 V-172', '#8a94a8', 4)}${c(0, -176, 7, '#ff5a5a', 'class="glow"')}
  ${r(-24, -138, 48, 28, 8, '#2a3448')}${c(-11, -124, 6, '#7af0ff')}${c(11, -124, 6, '#7af0ff')}
  ${s('M-8 -112 Q0 -106 8 -112', '#7af0ff', 2.5)}`;

  const ufo = `
  ${p('M-26 -10 L-36 4 M26 -10 L36 4', 'none', 'stroke="#c8d4e8" stroke-width="4"')}
  ${e(0, -60, 34, 30, '#cfefff', 'opacity=".55" stroke="#e8f6ff" stroke-width="3"')}
  ${c(0, -60, 16, '#6ad86a')}${eyes(-6, 6, -62, 3.5)}${s('M-5 -52 Q0 -48 5 -52', '#2a7a2a', 2)}
  ${e(0, -36, 70, 20, '#9aa4c8')}${e(0, -40, 70, 12, '#b8c4e8')}
  ${c(-44, -34, 6, '#ffd23f', 'class="twinkle"')}${c(-16, -28, 6, '#ff5a8a', 'class="twinkle d2"')}${c(16, -28, 6, '#5aff8a', 'class="twinkle d3"')}${c(44, -34, 6, '#5ad0ff', 'class="twinkle"')}`;

  const rocket = `
  ${e(0, 4, 18, 30, 'url(#all-flame)', 'class="glow"')}
  ${p('M-28 -10 L-44 10 L-44 -30 L-26 -50Z', '#e83a3a')}${p('M28 -10 L44 10 L44 -30 L26 -50Z', '#e83a3a')}
  ${p('M-26 -10 Q-34 -110 0 -150 Q34 -110 26 -10Z', '#f4f6fa', 'stroke="#c8d0dc" stroke-width="3"')}
  ${p('M-16 -124 Q0 -156 16 -124Z', '#e83a3a')}
  ${c(0, -84, 16, '#5ab0f0', 'stroke="#8a94a8" stroke-width="5"')}${eyes(-6, 6, -86, 3.5)}${s('M-5 -78 Q0 -74 5 -78', '#1a4a8a', 2)}
  ${r(-26, -24, 52, 14, 4, '#e83a3a')}`;

  // ---- weitere Figuren und Dinge ----
  const extra = (() => {
    const satellite = `
    ${r(-90, -56, 50, 24, 3, '#3a6ad8')}${r(40, -56, 50, 24, 3, '#3a6ad8')}${s('M-90 -44 H-40 M40 -44 H90 M-65 -56 V-32 M65 -56 V-32', '#8ab0f0', 2)}
    ${s('M-40 -44 H40', '#8a94a8', 4)}
    ${r(-22, -66, 44, 44, 8, '#d8dce8')}${c(0, -44, 12, '#5ab0f0')}${eyes(-5, 5, -46, 3)}
    ${s('M0 -66 V-84', '#8a94a8', 3)}${c(0, -88, 5, '#ff5a5a', 'class="twinkle"')}`;
    const comet = `
    ${p('M-20 -40 Q-120 -60 -150 -30 Q-110 -36 -20 -24Z', '#ffe08a', 'opacity=".7"')}${p('M-20 -46 Q-100 -90 -140 -76 Q-100 -62 -20 -32Z', '#ffc04a', 'opacity=".5"')}
    ${p('M0 -74 L10 -50 L36 -48 L16 -32 L22 -6 L0 -20 L-22 -6 L-16 -32 L-36 -48 L-10 -50Z', '#ffd23f', 'stroke="#ffb02a" stroke-width="4" stroke-linejoin="round"')}
    ${eyes(-6, 6, -40, 3)}${s('M-5 -30 Q0 -26 5 -30', '#a86a10', 2)}`;
    const moonBunny = FW.art.hase.split('#c9b6a4').join('#d8d0e8').split('#d6c4b2').join('#e4dcf0') + helmet(-106, 54);
    const monster = alien.split('#6ad86a').join('#b07ae6').split('#5ac85a').join('#9a62d8').split('#2a7a2a').join('#5a2a8a');
    return [
      { id: 'satellit', name: 'Satellit', icon: '🛰️', kind: 'fly', h: 92, eye: 46, speed: 140, art: satellite, perches: [] },
      { id: 'komet', name: 'Komet', icon: '☄️', kind: 'fly', h: 76, eye: 40, speed: 420, art: comet, perches: [], w: 0.5 },
      { id: 'mondhase', name: 'Mondhase', icon: '🐰', kind: 'walk', h: 200, eye: 106, speed: 120, hop: 70, freq: 1.1, art: moonBunny },
      { id: 'monster', name: 'Lila Monster', icon: '👾', kind: 'walk', h: 150, eye: 76, speed: 120, hop: 60, freq: 1.3, art: monster },
    ];
  })();

  FW.scene({
    id: 'weltall', name: 'Weltall', icon: '🚀', bg: '#0b0f2e',
    back, front,
    under: '#c4c4d4',
    ground: 700, lane: [760, 808],
    covers: [
      { x: 250, top: 645, w: 150 },
      { x: 565, top: 600, w: 130 },
      { x: 920, top: 568, w: 180, big: true },
      { x: 1210, top: 652, w: 120 },
      { x: 1470, top: 565, w: 200, big: true },
    ],
    air: { x0: 120, x1: 1500, y0: 260, y1: 620 },
    perches: [{ x: 250, y: 646 }, { x: 565, y: 602 }, { x: 920, y: 566 }, { x: 1470, y: 566 }],
    animals: [
      { id: 'astrokatze', name: 'Astronauten-Katze', icon: '🐱', kind: 'walk', h: 166, eye: 122, speed: 110, hop: 60, freq: 1.2, art: astroCat },
      { id: 'astrohund', name: 'Astronauten-Hund', icon: '🐶', kind: 'walk', h: 166, eye: 124, speed: 110, hop: 60, freq: 1.1, art: astroDog },
      { id: 'alien', name: 'Alien', icon: '👽', kind: 'walk', h: 150, eye: 76, speed: 130, hop: 70, freq: 1.3, art: alien },
      { id: 'roboter', name: 'Roboter', icon: '🤖', kind: 'walk', h: 184, eye: 124, speed: 90, hop: 3, freq: 4, tilt: 3, art: robot },
      { id: 'ufo', name: 'UFO', icon: '🛸', kind: 'fly', h: 90, eye: 62, speed: 260, art: ufo },
      { id: 'rakete', name: 'Rakete', icon: '🚀', kind: 'fly', h: 180, eye: 86, speed: 300, art: rocket, s: 0.8, perches: [] },
      ...extra,
    ],
  });
})();
