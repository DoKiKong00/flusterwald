/* Bereich: Nacht */
(() => {
  const { c, e, p, s, g, r, eyes, eye, cheeks, face } = FW;

  const stars = [[420, 90], [560, 200], [700, 70], [860, 160], [980, 60], [1120, 210], [1260, 100], [1400, 180], [1520, 70], [320, 260], [760, 300], [1180, 330], [90, 330], [1560, 300]]
    .map(([x, y], i) => c(x, y, 3 + (i % 3), '#fff6c8', `class="twinkle ${['', 'd2', 'd3'][i % 3]}"`)).join('');

  const back = `
  <defs>
    <linearGradient id="nacht-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141c44"/><stop offset="1" stop-color="#3a4a8a"/></linearGradient>
    <radialGradient id="nacht-glow"><stop offset="0" stop-color="#fff7b0" stop-opacity=".9"/><stop offset="1" stop-color="#fff7b0" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#nacht-sky)"/>
  ${stars}
  <g id="mood" transform="translate(220 160)">
    ${c(0, 0, 110, '#fff7c8', 'opacity=".12" class="pulse"')}
    ${c(0, 0, 72, '#fbf1c0')}${c(-26, 26, 12, '#ece0a6')}${c(30, -30, 9, '#ece0a6')}${c(36, 30, 7, '#ece0a6')}
    ${face(72, { ink: '#5a4a2a', sleepy: true })}
    <g class="calm"><text x="74" y="4" font-family="inherit" font-weight="900" font-size="30" fill="#c9d4ff">z</text><text x="98" y="-20" font-family="inherit" font-weight="900" font-size="22" fill="#c9d4ff">z</text></g>
  </g>
  <path d="M0 600 Q260 500 520 590 T1040 560 T1600 560 V900 H0Z" fill="#26346a"/>
  <path d="M0 650 Q300 590 640 640 T1300 620 T1600 630 V900 H0Z" fill="#2c4466"/>
  <!-- Haus mit Licht -->
  ${p('M700 560 L760 510 L820 560Z', '#1c2448')}${r(712, 560, 96, 80, 0, '#1f2a52')}${r(744, 584, 30, 30, 3, '#ffd96a')}${s('M759 584 V614 M744 599 H774', '#1f2a52', 3)}
  <!-- großer Baum rechts -->
  ${c(1380, 210, 140, '#1d3a3a')}${c(1500, 260, 120, '#1d3a3a')}${c(1440, 130, 110, '#224444')}
  ${p('M1370 740 Q1390 560 1380 300 L1490 300 Q1480 560 1500 740Z', '#3a2a24')}
  ${s('M1490 420 Q1540 400 1590 410', '#3a2a24', 18)}
  ${e(1435, 420, 40, 48, '#2a1c16')}${e(1435, 420, 34, 42, '#120a06')}`;

  const leaves = (x, y) => [[-90, 10, '#c0662a'], [-50, -20, '#d9862a'], [0, -36, '#b0502a'], [50, -18, '#d9a02a'], [90, 12, '#c0662a'], [-30, 20, '#a8452a'], [30, 18, '#d9862a']]
    .map(([dx, dy, col]) => e(x + dx, y + dy, 60, 36, col, 'opacity=".95"')).join('');

  const front = `
  <rect y="700" width="1600" height="200" fill="#2e5a44"/>
  <rect y="700" width="1600" height="12" fill="#3a6a50"/>
  <!-- Höhle im Felsen -->
  ${p('M110 760 Q120 560 270 540 Q420 560 430 760Z', '#5a5a74')}${p('M200 760 Q210 650 270 640 Q330 650 340 760Z', '#1a1a2a')}
  ${s('M150 640 Q190 600 230 596', '#6e6e8a', 8)}
  <!-- Laubhaufen -->
  ${leaves(620, 700)}
  <!-- Baumstumpf -->
  ${r(860, 610, 120, 130, 16, '#6a4a34')}${e(920, 612, 60, 18, '#a8805a')}${e(920, 612, 34, 9, 'none', 'stroke="#8a6440" stroke-width="4"')}
  ${p('M860 720 Q830 740 810 740 L870 740Z', '#6a4a34')}${p('M980 720 Q1010 740 1030 740 L970 740Z', '#6a4a34')}
  <!-- Busch -->
  ${FW.bush(1180, 712, 60, '#1f4a36', '#2a5a42')}
  <!-- Pilze -->
  ${e(470, 760, 22, 12, '#e0503a')}${r(464, 760, 12, 22, 4, '#f4ead4')}${c(462, 756, 3, '#fff')}${c(476, 754, 3, '#fff')}
  ${e(1040, 790, 16, 9, '#e0503a')}${r(1036, 790, 8, 16, 3, '#f4ead4')}`;

  const bat = `
  <g class="wings2">${p('M-8 -40 Q-40 -80 -96 -64 Q-80 -50 -84 -36 Q-66 -44 -60 -30 Q-44 -40 -30 -24Z', '#5a4a7a')}
    ${p('M8 -40 Q40 -80 96 -64 Q80 -50 84 -36 Q66 -44 60 -30 Q44 -40 30 -24Z', '#5a4a7a')}</g>
  ${e(0, -34, 26, 30, '#6e5c94')}${e(0, -26, 14, 18, '#8a7aac')}
  ${p('M-20 -70 L-22 -100 L-4 -76Z', '#6e5c94')}${p('M20 -70 L22 -100 L4 -76Z', '#6e5c94')}
  ${p('M-16 -76 L-17 -92 L-8 -78Z', '#e8a8c8')}${p('M16 -76 L17 -92 L8 -78Z', '#e8a8c8')}
  ${c(0, -62, 20, '#6e5c94')}${c(-8, -64, 6, '#fff')}${c(8, -64, 6, '#fff')}${eyes(-7, 9, -64, 3.5)}
  ${p('M-5 -50 L-3 -45 L-1 -50Z', '#fff')}${p('M1 -50 L3 -45 L5 -50Z', '#fff')}${cheeks(-14, 14, -54, 4, '#e8a8c8')}`;

  const raccoon = `
  <g class="tail">${p('M30 -30 Q90 -30 96 -80 Q100 -100 84 -104 Q80 -60 30 -50Z', '#8a8a96')}
    ${s('M60 -36 L70 -50 M78 -46 L90 -60 M86 -70 L98 -76', '#3a3a44', 9)}</g>
  ${r(-36, -20, 16, 22, 7, '#3a3a44')}${r(20, -20, 16, 22, 7, '#3a3a44')}
  ${e(0, -40, 46, 38, '#9a9aa6')}${e(0, -32, 24, 22, '#c8c8d0')}
  ${c(-30, -120, 16, '#8a8a96')}${c(30, -120, 16, '#8a8a96')}${c(-30, -120, 8, '#3a3a44')}${c(30, -120, 8, '#3a3a44')}
  ${c(0, -94, 40, '#a8a8b4')}
  ${p('M-40 -100 Q-20 -114 0 -98 Q20 -114 40 -100 Q30 -82 0 -88 Q-30 -82 -40 -100Z', '#2e2e38')}
  ${e(0, -74, 18, 13, '#eeeef2')}${c(0, -80, 6, '#2b1d14')}
  ${c(-16, -98, 7, '#fff')}${c(16, -98, 7, '#fff')}${eyes(-15, 17, -98, 4.5)}`;

  const badger = `
  ${r(-46, -16, 18, 18, 7, '#2e2e34')}${r(28, -16, 18, 18, 7, '#2e2e34')}
  ${e(-10, -36, 66, 32, '#7a7a84')}
  ${e(50, -46, 36, 30, '#f4f4f4')}
  ${p('M30 -72 Q56 -76 80 -46 Q60 -56 44 -56Z', '#2e2e34')}${p('M28 -24 Q50 -32 80 -40 Q60 -24 40 -20Z', '#2e2e34')}
  ${c(30, -70, 10, '#2e2e34')}${c(30, -70, 5, '#f4f4f4')}
  ${c(86, -42, 6, '#2b1d14')}${eye(58, -52, 4.5)}${c(64, -38, 6, '#f2a5a5', 'opacity=".5"')}`;

  const mouse = `
  ${s('M-26 -10 Q-70 -6 -76 -34', '#f2a5b5', 5)}
  ${e(0, -24, 30, 24, '#a8a0a8')}${e(4, -18, 16, 14, '#d8d0d8')}
  ${c(-16, -66, 18, '#a8a0a8')}${c(16, -66, 18, '#a8a0a8')}${c(-16, -66, 11, '#f2b5c5')}${c(16, -66, 11, '#f2b5c5')}
  ${c(0, -46, 22, '#b4acb4')}${c(0, -36, 5, '#e07a8a')}
  ${eyes(-9, 9, -50, 4)}${s('M-6 -36 L-26 -40 M-6 -34 L-26 -30 M6 -36 L26 -40 M6 -34 L26 -30', '#7a707a', 1.5)}`;

  const eagleOwl = `
  <g class="wing wl">${e(-38, -50, 14, 34, '#6a4a2c')}</g><g class="wing wr">${e(38, -50, 14, 34, '#6a4a2c')}</g>
  ${p('M-36 -86 L-40 -120 L-16 -94Z', '#6a4a2c')}${p('M36 -86 L40 -120 L16 -94Z', '#6a4a2c')}
  ${e(0, -48, 40, 50, '#8a6038')}${e(0, -30, 26, 26, '#d4b080')}
  ${s('M-14 -36 L-8 -30 M0 -40 L6 -34 M-6 -22 L0 -16 M10 -26 L14 -20', '#8a6038', 3)}
  ${s('M-12 -2 L-8 4 L-4 -2 M4 -2 L8 4 L12 -2', '#f0a030', 3)}
  ${c(-16, -68, 15, '#ffb030')}${c(16, -68, 15, '#ffb030')}${eyes(-15, 15, -68, 7.5)}
  ${p('M-6 -54 L6 -54 L0 -42Z', '#4a3a2a')}`;

  const firefly = `
  ${c(-14, -14, 34, 'url(#nacht-glow)', 'class="glow"')}
  <g class="wings2">${e(-2, -34, 10, 16, '#dfe8ff', FW.rot(-30, -2, -34) + ' opacity=".7"')}${e(10, -34, 10, 16, '#dfe8ff', FW.rot(30, 10, -34) + ' opacity=".7"')}</g>
  ${e(-14, -14, 14, 11, '#fff27a')}
  ${e(4, -22, 12, 10, '#4a4060')}${c(18, -28, 9, '#5a5070')}
  ${s('M20 -36 Q24 -46 30 -48 M16 -36 Q16 -46 20 -50', '#5a5070', 2)}
  ${eye(21, -29, 3)}`;

  FW.scene({
    id: 'nacht', name: 'Nacht', icon: '🌙', bg: '#141c44',
    back, front,
    under: '#2e5a44',
    ground: 700, lane: [760, 805],
    covers: [
      { x: 270, top: 545, w: 200, big: true },
      { x: 620, top: 652, w: 150 },
      { x: 920, top: 602, w: 110 },
      { x: 1180, top: 648, w: 140 },
    ],
    hole: { x: 1435, y: 420, rx: 34, ry: 42 },
    air: { x0: 100, x1: 1500, y0: 260, y1: 640 },
    perches: [
      { x: 1560, y: 404 }, { x: 1520, y: 404 }, { x: 920, y: 604 }, { x: 270, y: 548 }, { x: 760, y: 512 },
      { x: 1380, y: 90 }, { x: 1180, y: 648 },
    ],
    animals: [
      { id: 'fledermaus', name: 'Fledermaus', icon: '🦇', kind: 'fly', h: 100, eye: 64, speed: 320, art: bat },
      { id: 'waschbaer', name: 'Waschbär', icon: '🦝', kind: 'walk', h: 140, eye: 98, speed: 130, hop: 5, freq: 3.2, art: raccoon },
      { id: 'dachs', name: 'Dachs', icon: '🦡', kind: 'walk', h: 80, eye: 52, speed: 90, hop: 3, freq: 4, tilt: 3, art: badger },
      { id: 'maus', name: 'Maus', icon: '🐭', kind: 'walk', h: 84, eye: 50, speed: 240, hop: 4, freq: 7, art: mouse },
      { id: 'uhu', name: 'Uhu', icon: '🦉', kind: 'fly', h: 118, eye: 68, speed: 280, art: eagleOwl },
      { id: 'gluehwuermchen', name: 'Glühwürmchen', icon: '✨', kind: 'fly', h: 50, eye: 29, speed: 140, art: firefly, s: 1.3, perches: [],
        area: { x0: 100, x1: 1500, y0: 300, y1: 660 } },
    ],
  });
})();
