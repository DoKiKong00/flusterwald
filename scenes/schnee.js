/* Bereich: Schnee und Eis */
(() => {
  const { c, e, p, s, g, r, eyes, eye, cheeks, face } = FW;
  const W = '#ffffff', LINE = 'stroke="#b8c8dc" stroke-width="3"';
  const w = (shape) => shape.replace('/>', ` ${LINE}/>`); // weiße Form mit Umriss

  const flakes = [...Array(22)].map((_, i) => c((i * 173) % 1600, -20 - (i * 37) % 300, 3 + (i % 3) * 2, '#fff',
    `class="snow s${i % 4}" opacity=".9"`)).join('');

  const back = `
  <defs>
    <linearGradient id="schnee-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc8ef"/><stop offset="1" stop-color="#e6f2fc"/></linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#schnee-sky)"/>
  ${s('M300 120 Q700 40 1100 120 T1600 100', '#9ef0c8', 30, 'opacity=".35"')}${s('M200 170 Q700 90 1200 170', '#c8a0f0', 20, 'opacity=".25"')}
  <!-- Schneemann -->
  <g id="mood" transform="translate(210 320) scale(.78)">
    <g class="shake-me">
      ${w(c(0, 40, 62, W))}${w(c(0, -50, 46, W))}${w(c(0, -122, 38, W))}
      ${r(-34, -168, 68, 10, 4, '#2b2b3a')}${r(-24, -214, 48, 50, 6, '#2b2b3a')}${r(-24, -178, 48, 8, 0, '#d9452a')}
      ${s('M-30 -80 Q0 -66 30 -80', '#d9452a', 14)}${s('M20 -76 L30 -40', '#d9452a', 12)}
      ${c(0, -40, 5, '#2b2b3a')}${c(0, -20, 5, '#2b2b3a')}${c(0, 10, 5, '#2b2b3a')}
      ${s('M-44 -50 L-96 -84 M-80 -74 L-92 -96 M44 -50 L96 -84 M80 -74 L94 -96', '#7a5230', 6)}
      ${p('M0 -118 L40 -110 L0 -104Z', '#ff8a2a')}
      <g transform="translate(0 -122)">${face(38, { ink: '#2b2b3a', cheeks: true })}</g>
    </g>
  </g>
  ${p('M480 640 L640 470 L760 600 L860 500 L1020 640Z', '#d6e8f8')}${p('M640 470 L680 530 L620 560Z', '#fff')}${p('M860 500 L900 560 L840 580Z', '#fff')}
  <path d="M0 640 Q400 590 800 630 T1600 620 V900 H0Z" fill="#eaf4fd"/>
  ${flakes}`;

  const front = `
  <rect y="700" width="1600" height="200" fill="#f6fbff"/>
  <path d="M0 700 Q400 688 800 702 T1600 698 V716 H0Z" fill="#e2eef9"/>
  <!-- Eisberg -->
  ${p('M110 760 L150 600 L220 520 L300 560 L360 640 L400 760Z', '#cfe8f8')}${p('M220 520 L250 600 L200 700 L150 600Z', '#e8f5fd')}${p('M300 560 L330 640 L290 720Z', '#b8daf2')}
  <!-- Schneewehe -->
  ${p('M480 760 Q500 660 600 648 Q700 660 720 760Z', '#ffffff', LINE)}
  <!-- Iglu -->
  ${p('M800 760 Q800 590 920 586 Q1040 590 1040 760Z', '#ffffff', LINE)}
  ${s('M812 700 H1028 M824 650 H1016 M850 612 H990 M880 700 V650 M960 700 V650 M920 650 V612 M850 760 V700 M990 760 V700', '#c8d8ea', 3)}
  ${p('M880 760 Q880 700 920 698 Q960 700 960 760Z', '#4a6a8a')}
  <!-- Eisloch -->
  ${e(1200, 724, 84, 22, '#3a7ab8')}${e(1200, 722, 70, 14, '#5a9ad8')}
  ${p('M1110 726 Q1120 690 1200 686 Q1280 690 1290 726 Q1200 714 1110 726Z', '#ffffff', LINE)}
  <!-- große Schneewehe -->
  ${p('M1340 760 Q1360 620 1470 600 Q1580 610 1600 640 L1600 760Z', '#ffffff', LINE)}
  ${c(1440, 700, 6, '#d6e6f6')}${c(1520, 660, 5, '#d6e6f6')}`;

  const penguin = `
  ${e(-14, -2, 14, 6, '#ff9a2a')}${e(14, -2, 14, 6, '#ff9a2a')}
  ${e(0, -60, 42, 60, '#2b2f3e')}${e(0, -50, 30, 46, '#fff')}
  <g class="wiggle">${e(-40, -60, 10, 30, '#2b2f3e', FW.rot(16, -40, -60))}${e(40, -60, 10, 30, '#2b2f3e', FW.rot(-16, 40, -60))}</g>
  ${c(0, -118, 32, '#2b2f3e')}${e(-12, -114, 12, 14, '#fff')}${e(12, -114, 12, 14, '#fff')}
  ${eyes(-10, 12, -116, 5)}${p('M-8 -102 L8 -102 L0 -90Z', '#ff9a2a')}${cheeks(-22, 22, -100, 6, '#ffb3b3')}`;

  const polarBear = `
  <g class="legs">${w(r(-62, -44, 30, 46, 14, W))}${w(r(32, -44, 30, 46, 14, W))}</g>
  ${w(r(-40, -44, 28, 46, 14, '#f4f8fc'))}${w(r(12, -44, 28, 46, 14, '#f4f8fc'))}
  ${w(e(-10, -84, 82, 50, W))}
  ${w(c(-38, -186, 16, W))}${w(c(38, -186, 16, W))}${c(-38, -186, 8, '#e8eef6')}${c(38, -186, 8, '#e8eef6')}
  ${w(c(0, -150, 48, W))}
  ${e(0, -128, 22, 16, '#f0f4f8')}${e(0, -136, 9, 7, '#2b2b3a')}${s('M0 -130 V-122 M0 -122 Q-6 -116 -10 -120 M0 -122 Q6 -116 10 -120', '#2b2b3a', 2.5)}
  ${eyes(-17, 17, -156, 5.5)}${cheeks(-30, 30, -136, 8, '#ffc0c8')}`;

  const seal = `
  <g class="tail">${p('M-70 -16 L-108 -36 L-100 -10 L-110 6Z', '#8a9aac')}</g>
  ${p('M-80 -10 Q-60 -70 10 -78 Q60 -80 70 -40 Q74 0 20 0 L-60 0Z', '#9aaabc')}
  ${e(10, -16, 50, 12, '#c4d0dc')}
  <g class="fin">${e(10, -10, 22, 9, '#8a9aac', FW.rot(20, 10, -10))}</g>
  ${c(50, -86, 36, '#a8b8ca')}
  ${e(66, -76, 16, 12, '#c4d0dc')}${c(74, -82, 5, '#2b2b3a')}
  ${s('M64 -74 L92 -78 M64 -70 L92 -66', '#6a7a8c', 1.5)}
  ${c(42, -96, 9, '#2b2b3a')}${c(66, -98, 9, '#2b2b3a')}${c(45, -99, 3, '#fff')}${c(69, -101, 3, '#fff')}
  ${c(36, -74, 6, '#ffc0c8', 'opacity=".6"')}`;

  const arcticFox = `
  <g class="tail">${w(p('M36 -24 C110 -30 120 -100 80 -120 C96 -80 80 -50 40 -50Z', W))}</g>
  ${w(r(-30, -22, 14, 24, 6, '#eef3f8'))}${w(r(16, -22, 14, 24, 6, '#eef3f8'))}
  ${w(e(0, -34, 48, 32, W))}
  ${w(p('M-36 -106 L-30 -146 L-6 -118Z', W))}${w(p('M36 -106 L30 -146 L6 -118Z', W))}
  ${p('M-30 -112 L-28 -134 L-14 -118Z', '#e8d0dc')}${p('M30 -112 L28 -134 L14 -118Z', '#e8d0dc')}
  ${w(e(0, -90, 42, 36, W))}
  ${c(0, -70, 6.5, '#2b2b3a')}${eyes(-16, 16, -96, 5.5)}${cheeks(-28, 28, -78, 7, '#ffc0c8')}`;

  const snowHare = `
  <g class="ears">
    ${w(e(-18, -156, 12, 40, W, FW.rot(-8, -18, -156)))}${e(-18, -152, 5, 26, '#ffd0d8', FW.rot(-8, -18, -152))}
    ${w(e(18, -156, 12, 40, W, FW.rot(8, 18, -156)))}${e(18, -152, 5, 26, '#ffd0d8', FW.rot(8, 18, -152))}
    ${e(-20, -192, 7, 6, '#4a4a5a', FW.rot(-8, -20, -192))}${e(20, -192, 7, 6, '#4a4a5a', FW.rot(8, 20, -192))}
  </g>
  ${w(e(-28, -6, 18, 9, W))}${w(e(28, -6, 18, 9, W))}
  ${w(e(0, -44, 48, 44, W))}
  ${w(c(0, -100, 38, W))}${cheeks(-22, 22, -88, 8, '#ffc0c8')}${eyes(-14, 14, -106)}
  ${e(0, -92, 5, 4, '#e07a8a')}`;

  const snowOwl = `
  <g class="wing wl">${w(e(-34, -46, 13, 30, W))}</g><g class="wing wr">${w(e(34, -46, 13, 30, W))}</g>
  ${w(e(0, -42, 36, 44, W))}
  ${s('M-16 -30 h6 M8 -22 h6 M-6 -14 h6 M14 -38 h6 M-20 -46 h6', '#7a8a9c', 3)}
  ${s('M-12 -2 L-8 4 L-4 -2 M4 -2 L8 4 L12 -2', '#4a4a5a', 3)}
  ${c(-14, -58, 13, '#ffd23f')}${c(14, -58, 13, '#ffd23f')}${eyes(-13, 13, -57, 6.5)}
  ${p('M-6 -46 L6 -46 L0 -36Z', '#4a4a5a')}`;

  // ---- weitere Tiere ----
  const extra = (() => {
    const { c, e, p, s, r, eyes, eye, cheeks } = FW;
    const reindeer = `
    <g class="legs">${r(-50, -80, 12, 82, 5, '#8a5a3a')}${r(32, -80, 12, 82, 5, '#8a5a3a')}</g>
    ${r(-32, -80, 12, 82, 5, '#7a4a2a')}${r(14, -80, 12, 82, 5, '#7a4a2a')}
    ${e(-6, -104, 62, 34, '#9a6a44')}${e(30, -110, 22, 26, '#f0e6d8')}
    ${p('M30 -120 Q44 -160 64 -176 L86 -162 Q70 -140 56 -104Z', '#9a6a44')}
    ${s('M68 -184 Q60 -220 40 -230 M60 -204 L44 -206 M76 -184 Q88 -222 108 -230 M84 -206 L100 -210', '#c8a070', 6)}
    ${e(84, -170, 28, 18, '#a87a50', FW.rot(30, 84, -170))}${c(106, -156, 8, '#e8302a')}
    ${eye(80, -176, 4.5)}${c(86, -164, 5, '#ff9ec4', 'opacity=".5"')}`;
    const walrus = `
    <g class="fin">${e(-30, -6, 24, 10, '#8a5a40', FW.rot(10, -30, -6))}${e(30, -6, 24, 10, '#8a5a40', FW.rot(-10, 30, -6))}</g>
    ${p('M-70 -4 Q-80 -90 0 -110 Q80 -90 70 -4Z', '#a87050')}
    ${c(0, -100, 40, '#b47a58')}
    ${e(-14, -82, 16, 12, '#d8a888')}${e(14, -82, 16, 12, '#d8a888')}
    ${p('M-12 -74 L-14 -36 L-6 -72Z', '#fffaf0')}${p('M12 -74 L14 -36 L6 -72Z', '#fffaf0')}
    ${eyes(-14, 14, -110, 4.5)}${c(0, -92, 5, '#5a3a2a')}`;
    const husky = `
    <g class="tail">${s('M30 -20 Q76 -26 66 -70 Q58 -84 50 -70', '#6a6e7a', 12)}</g>
    ${e(-18, -4, 14, 8, '#fff')}${e(18, -4, 14, 8, '#fff')}
    ${e(0, -42, 40, 40, '#6a6e7a')}${e(0, -34, 22, 30, '#fff')}
    ${p('M-36 -112 L-30 -150 L-8 -122Z', '#6a6e7a')}${p('M36 -112 L30 -150 L8 -122Z', '#6a6e7a')}
    ${c(0, -100, 38, '#6a6e7a')}
    ${p('M-24 -122 Q0 -100 24 -122 Q30 -86 0 -76 Q-30 -86 -24 -122Z', '#fff')}
    ${e(0, -84, 8, 6, '#2b2b2b')}${p('M-4 -74 Q0 -66 4 -74Z', '#ff8aa0')}
    <g class="blink">${c(-14, -106, 5.5, '#4ab0f0')}${c(14, -106, 5.5, '#4ab0f0')}</g>${c(-14, -106, 2.5, '#1a1a1a')}${c(14, -106, 2.5, '#1a1a1a')}`;
    const puffin = `
    <g class="wing wl">${e(-30, -46, 12, 26, '#2b2b30')}</g><g class="wing wr">${e(30, -46, 12, 26, '#2b2b30')}</g>
    ${e(0, -40, 28, 34, '#2b2b30')}${e(0, -34, 18, 26, '#fff')}
    ${s('M-8 0 V-8 M8 0 V-8', '#ff8a2a', 4)}
    ${c(0, -80, 22, '#2b2b30')}${e(-2, -80, 16, 14, '#f4f4f4')}
    ${p('M10 -88 Q34 -84 32 -70 Q20 -66 10 -72Z', '#ff7a2a')}${s('M14 -86 Q20 -78 14 -72', '#ffd23f', 3)}
    ${eye(-2, -84, 4)}`;
    return [
      { id: 'rentier', name: 'Rentier', kind: 'walk', h: 236, eye: 176, speed: 150, hop: 8, freq: 2.4, art: reindeer, big: true },
      { id: 'walross', name: 'Walross', kind: 'walk', h: 140, eye: 110, speed: 60, hop: 8, freq: 2, tilt: 4, art: walrus },
      { id: 'husky', name: 'Husky', kind: 'walk', h: 150, eye: 106, speed: 210, hop: 10, freq: 4, art: husky },
      { id: 'papageitaucher', name: 'Papageitaucher', kind: 'fly', h: 104, eye: 84, speed: 300, art: puffin },
    ];
  })();

  FW.scene({
    id: 'schnee', name: 'Schnee', bg: '#9fc8ef',
    back, front,
    under: '#f6fbff',
    ground: 700, lane: [760, 808],
    covers: [
      { x: 255, top: 525, w: 180, big: true },
      { x: 600, top: 652, w: 140 },
      { x: 920, top: 592, w: 160, big: true },
      { x: 1200, top: 690, w: 110 },
      { x: 1470, top: 605, w: 180, big: true },
    ],
    perches: [
      { x: 220, y: 524 }, { x: 300, y: 560 }, { x: 920, y: 590 }, { x: 640, y: 470 }, { x: 860, y: 500 },
      { x: 1470, y: 604 }, { x: 600, y: 650 },
    ],
    animals: [
      { id: 'pinguin', name: 'Pinguin', kind: 'walk', h: 150, eye: 116, speed: 90, hop: 2, freq: 4, tilt: 9, art: penguin },
      { id: 'eisbaer', name: 'Eisbär', kind: 'walk', h: 205, eye: 156, speed: 100, hop: 4, freq: 2.4, art: polarBear, big: true },
      { id: 'robbe', name: 'Robbe', kind: 'walk', h: 122, eye: 96, speed: 70, hop: 10, freq: 2.6, tilt: 4, art: seal },
      { id: 'polarfuchs', name: 'Polarfuchs', kind: 'walk', h: 150, eye: 96, speed: 160, hop: 6, freq: 3.2, art: arcticFox },
      { id: 'schneehase', name: 'Schneehase', kind: 'walk', h: 200, eye: 106, speed: 170, hop: 30, freq: 2.4, art: snowHare },
      { id: 'schneeeule', name: 'Schneeeule', kind: 'fly', h: 100, eye: 57, speed: 300, art: snowOwl },
      ...extra,
    ],
  });
})();
