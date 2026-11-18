/* Bereich: Garten */
(() => {
  const { c, e, p, s, g, r, eyes, eye, cheeks, face, flower } = FW;

  // Stimmungsfigur: Sonnenblume
  const petals = [...Array(14)].map((_, i) => {
    const a = (i / 14) * 360;
    return e(0, -78, 18, 36, i % 2 ? '#ffc21a' : '#ffd23f', `transform="rotate(${a})"`);
  }).join('');
  const mood = `
  <g id="mood" transform="translate(220 200)">
    ${s('M0 40 Q-20 300 10 520', '#4a9a3a', 14)}${e(-40, 240, 46, 18, '#5ab84a', FW.rot(-30, -40, 240))}${e(36, 330, 46, 18, '#5ab84a', FW.rot(30, 36, 330))}
    <g class="shake-me">${petals}${c(0, 0, 58, '#7a4a20')}${c(0, 0, 50, '#8a5a2a')}${face(50, { ink: '#3a2010' })}</g>
  </g>`;

  const back = `
  <defs>
    <linearGradient id="garten-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3f4"/><stop offset="1" stop-color="#f4f8e0"/></linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#garten-sky)"/>
  ${FW.cloud(700, 120)}${FW.cloud(1150, 180, 0.6, '#fff', 'cloud c2')}
  <!-- Gartenhaus -->
  ${p('M1060 420 L1200 330 L1340 420Z', '#b0503a')}${r(1080, 420, 240, 260, 0, '#f4e2c0')}${r(1170, 520, 64, 160, 6, '#8a5a33')}${c(1222, 600, 5, '#f0c040')}
  ${r(1100, 450, 50, 46, 4, '#9ad0f0')}${s('M1125 450 V496 M1100 473 H1150', '#fff', 4)}
  <!-- Zaun -->
  ${[...Array(18)].map((_, i) => p(`M${i * 90 + 10} 700 V600 L${i * 90 + 30} 580 L${i * 90 + 50} 600 V700Z`, '#ffffff', 'stroke="#d8d0c0" stroke-width="2"')).join('')}
  ${r(0, 620, 1600, 12, 3, '#f4f0e8')}${r(0, 660, 1600, 12, 3, '#f4f0e8')}
  ${mood}`;

  const front = `
  <rect y="700" width="1600" height="200" fill="#7cc35a"/>
  <rect y="700" width="1600" height="12" fill="#6ab04a"/>
  <!-- Blumentopf -->
  ${p('M180 760 L196 640 L304 640 L320 760Z', '#d9733a')}${r(170, 620, 160, 30, 6, '#e8834a')}
  ${s('M220 620 Q210 560 230 520 M250 620 V500 M280 620 Q290 560 272 530', '#4a9a3a', 6)}
  ${flower(230, 516, '#ff6f91', 10)}${flower(250, 492, '#ffd23f', 9)}${flower(272, 524, '#9a7aff', 9)}
  <!-- Gießkanne -->
  ${r(490, 640, 140, 110, 18, '#4a9ad8')}${p('M630 680 L720 610 L732 622 L640 710Z', '#4a9ad8')}${e(726, 614, 16, 8, '#3a8ac8', FW.rot(-40, 726, 614))}
  ${s('M500 650 Q480 600 540 600 Q600 600 610 640', '#3a8ac8', 10)}${c(560, 700, 18, '#fff', 'opacity=".3"')}
  <!-- Gemüsebeet mit Kürbis -->
  ${r(780, 720, 260, 40, 8, '#8a5a33')}
  ${e(910, 690, 90, 60, '#ff8c1a')}${e(870, 690, 44, 58, '#ffa030')}${e(950, 690, 44, 58, '#ffa030')}${e(910, 690, 30, 60, '#ff9a22')}
  ${s('M910 632 Q904 610 920 600', '#4a7a2a', 8)}${e(944, 618, 26, 12, '#5ab84a', FW.rot(-20, 944, 618))}
  ${e(820, 714, 30, 14, '#5ab84a')}${e(1010, 714, 30, 14, '#5ab84a')}
  <!-- Maulwurfshügel -->
  ${p('M1120 762 Q1140 680 1200 672 Q1260 680 1280 762Z', '#7a5230')}${c(1170, 700, 6, '#8a6240')}${c(1220, 716, 5, '#8a6240')}${c(1190, 730, 7, '#6a4220')}
  <!-- Hecke -->
  ${r(1360, 560, 260, 200, 60, '#3f8f3f')}${c(1400, 600, 30, '#4ea54b')}${c(1480, 580, 34, '#4ea54b')}${c(1560, 610, 28, '#4ea54b')}
  ${c(1420, 640, 7, '#ff6f91')}${c(1520, 620, 7, '#fff')}${c(1580, 680, 7, '#ff6f91')}
  ${flower(90, 850, '#ff8fb1')}${flower(700, 870, '#fff', 8)}${flower(1080, 840, '#ffd23f', 8)}${flower(1330, 880, '#9ad0ff', 8)}`;

  const ladybug = `
  <g class="wings2">${e(-14, -46, 14, 26, '#dfeeff', FW.rot(-30, -14, -46) + ' opacity=".7"')}${e(14, -46, 14, 26, '#dfeeff', FW.rot(30, 14, -46) + ' opacity=".7"')}</g>
  ${s('M-20 -6 L-30 2 M0 -4 L0 4 M20 -6 L30 2', '#2b2b2b', 4)}
  ${e(0, -30, 36, 28, '#e8302a')}${s('M0 -58 V-2', '#2b2b2b', 3)}
  ${c(-16, -36, 7, '#2b2b2b')}${c(16, -36, 7, '#2b2b2b')}${c(-12, -18, 6, '#2b2b2b')}${c(14, -16, 6, '#2b2b2b')}${c(-20, -50, 5, '#2b2b2b')}${c(20, -50, 5, '#2b2b2b')}
  ${c(30, -50, 16, '#2b2b2b')}${c(28, -54, 5, '#fff')}${c(38, -54, 5, '#fff')}${c(29, -54, 2.5, '#2b2b2b')}${c(39, -54, 2.5, '#2b2b2b')}
  ${s('M28 -64 Q24 -76 18 -78 M36 -64 Q40 -76 46 -78', '#2b2b2b', 2.5)}`;

  const butterfly = `
  <g class="wings2">
    ${e(-30, -60, 30, 36, '#ff8ac4', FW.rot(-20, -30, -60))}${e(30, -60, 30, 36, '#ff8ac4', FW.rot(20, 30, -60))}
    ${e(-22, -26, 20, 22, '#ffb04a', FW.rot(20, -22, -26))}${e(22, -26, 20, 22, '#ffb04a', FW.rot(-20, 22, -26))}
    ${c(-30, -64, 10, '#fff', 'opacity=".7"')}${c(30, -64, 10, '#fff', 'opacity=".7"')}${c(-22, -26, 6, '#fff', 'opacity=".7"')}${c(22, -26, 6, '#fff', 'opacity=".7"')}
  </g>
  ${e(0, -40, 7, 32, '#5a3a6a')}${c(0, -76, 10, '#5a3a6a')}
  ${s('M-3 -84 Q-10 -100 -18 -102 M3 -84 Q10 -100 18 -102', '#5a3a6a', 2.5)}
  ${c(-4, -78, 2.5, '#fff')}${c(4, -78, 2.5, '#fff')}`;

  const bee = `
  <g class="wings2">${e(-8, -62, 14, 20, '#e8f6ff', FW.rot(-20, -8, -62) + ' opacity=".8" stroke="#a8d0e8" stroke-width="2"')}${e(10, -62, 14, 20, '#e8f6ff', FW.rot(20, 10, -62) + ' opacity=".8" stroke="#a8d0e8" stroke-width="2"')}</g>
  ${p('M-38 -36 L-50 -34 L-38 -30Z', '#2b2b2b')}
  ${e(-4, -34, 36, 26, '#ffd23f')}${s('M-18 -58 V-10 M0 -60 V-8', '#2b2b2b', 9)}
  ${c(34, -40, 18, '#ffd23f')}${c(38, -44, 4.5, '#2b2b2b')}${c(39.5, -45.5, 1.5, '#fff')}${s('M36 -32 Q42 -28 46 -34', '#2b2b2b', 2.5)}
  ${s('M32 -56 Q30 -70 22 -72 M40 -56 Q44 -70 52 -72', '#2b2b2b', 2.5)}${c(42, -34, 4, '#ff9e7a', 'opacity=".6"')}`;

  const snail = `
  ${p('M-56 0 Q-60 -14 -40 -16 L40 -16 Q60 -20 64 -50 Q70 -64 78 -50 Q80 -10 50 0Z', '#e8c89a')}
  ${s('M64 -52 L58 -80 M74 -52 L80 -80', '#e8c89a', 5)}${c(58, -82, 6, '#2b2b2b')}${c(80, -82, 6, '#2b2b2b')}${c(60, -84, 2, '#fff')}${c(82, -84, 2, '#fff')}
  ${s('M62 -38 Q68 -32 74 -38', '#8a6a4a', 2.5)}
  ${c(-6, -52, 42, '#c87a3a')}${p('M-6 -52 m0 -30 a30 30 0 1 1 -24 12 a20 20 0 1 1 18 -8 a10 10 0 1 1 -6 6', 'none', 'stroke="#a85a2a" stroke-width="6" stroke-linecap="round"')}`;

  const worm = `
  <g class="wiggle">${s('M-60 -10 Q-40 -40 -20 -12 Q0 16 20 -14 Q34 -36 44 -40', '#f29aa8', 22)}</g>
  ${s('M-30 -20 v8 M-10 -6 v8 M10 -8 v8', '#e07a8a', 3)}
  ${c(52, -46, 18, '#f4a4b2')}${eyes(46, 60, -50, 4)}${s('M46 -38 Q53 -32 60 -38', '#a04a5a', 2.5)}${cheeks(42, 64, -40, 4, '#ff7a90')}`;

  const mole = `
  ${e(-30, -6, 18, 8, '#f2b5b5')}${e(30, -6, 18, 8, '#f2b5b5')}
  ${e(0, -46, 48, 44, '#4a4a54')}
  ${e(-44, -40, 18, 12, '#f2b5b5', FW.rot(-30, -44, -40))}${e(44, -40, 18, 12, '#f2b5b5', FW.rot(30, 44, -40))}
  ${c(0, -96, 34, '#55555f')}
  ${e(0, -76, 13, 10, '#f29aa8')}${s('M-10 -78 L-30 -84 M-10 -74 L-30 -70 M10 -78 L30 -84 M10 -74 L30 -70', '#9a9aa4', 1.5)}
  ${s('M-18 -100 Q-12 -96 -6 -100 M6 -100 Q12 -96 18 -100', '#1a1a20', 3)}${cheeks(-22, 22, -86, 6, '#f2a5b5')}`;

  // ---- weitere Tiere ----
  const extra = (() => {
    const { c, e, p, s, r, eyes, eye, cheeks } = FW;
    const blackbird = `
    ${p('M-22 -26 L-50 -14 L-20 -16Z', '#1e1e24')}
    <g class="wing wl">${p('M-6 -50 C-30 -80 -56 -78 -60 -66 C-40 -62 -28 -54 -16 -40Z', '#2a2a32')}</g>
    <g class="wing wr">${p('M6 -50 C30 -80 56 -78 60 -66 C40 -62 28 -54 16 -40Z', '#2a2a32')}</g>
    ${e(0, -38, 26, 28, '#2a2a32')}${c(12, -70, 18, '#2a2a32')}
    ${p('M26 -74 L46 -70 L26 -64Z', '#ffb02a')}${c(16, -74, 6, '#ffb02a')}${eye(16, -74, 3.5)}
    ${s('M-4 -10 V0 M6 -10 V0', '#5a4a3a', 3)}`;
    const ant = `
    ${s('M-20 -20 L-34 0 M0 -20 L-6 0 M16 -20 L26 0', '#5a2a1a', 4)}
    ${e(-34, -30, 22, 16, '#a8401e')}${e(0, -32, 14, 11, '#b84a24')}${c(30, -40, 15, '#c4542a')}
    ${s('M36 -52 Q40 -70 52 -72 M30 -54 Q30 -72 40 -78', '#5a2a1a', 2.5)}
    ${c(34, -44, 6, '#fff')}${eye(36, -44, 3.5)}${s('M36 -32 Q40 -30 44 -34', '#5a2a1a', 2)}`;
    const caterpillar = `
    <g class="wiggle">${[-60, -40, -20, 0, 20].map((x, i) => c(x, -18 - (i % 2) * 4, 16, i % 2 ? '#7ad04a' : '#8ae05a')).join('')}</g>
    ${s('M-60 -2 v4 M-40 -2 v4 M-20 -2 v4 M0 -2 v4 M20 -2 v4', '#4a8a2a', 4)}
    ${c(42, -34, 20, '#9ae86a')}${s('M36 -52 L30 -66 M48 -52 L54 -66', '#4a8a2a', 3)}${c(30, -68, 4, '#ff6a8a')}${c(54, -68, 4, '#ff6a8a')}
    ${eyes(36, 50, -38, 4)}${s('M38 -26 Q44 -22 50 -26', '#3a6a1a', 2.5)}${cheeks(32, 54, -28, 4, '#ff9ec4')}`;
    const grasshopper = `
    ${s('M-20 -20 L-40 -50 L-50 0', '#5ab83a', 6)}${s('M10 -16 L6 0 M24 -16 L28 0', '#4aa82a', 4)}
    ${e(-6, -28, 40, 14, '#6ac84a')}
    <g class="wings2">${e(-10, -38, 30, 8, '#a8e888', 'opacity=".8"')}</g>
    ${c(38, -38, 16, '#7ad85a')}${s('M42 -52 Q50 -80 70 -84 M36 -52 Q36 -80 50 -90', '#4a8a2a', 2.5)}
    ${eye(44, -42, 4.5)}${s('M40 -28 Q46 -26 50 -30', '#3a6a1a', 2)}`;
    return [
      { id: 'amsel', name: 'Amsel', kind: 'fly', h: 88, eye: 74, speed: 300, art: blackbird },
      { id: 'ameise', name: 'Ameise', kind: 'walk', h: 80, eye: 44, speed: 140, hop: 2, freq: 8, art: ant, s: 1.1 },
      { id: 'raupe', name: 'Raupe', kind: 'walk', h: 72, eye: 38, speed: 40, hop: 3, freq: 2.5, art: caterpillar },
      { id: 'grashuepfer', name: 'Grashüpfer', kind: 'walk', h: 70, eye: 42, speed: 200, hop: 50, freq: 1.6, art: grasshopper, s: 1.1 },
    ];
  })();

  FW.scene({
    id: 'garten', name: 'Garten', bg: '#8fd3f4',
    back, front,
    under: '#7cc35a',
    ground: 700, lane: [760, 808],
    covers: [
      { x: 250, top: 622, w: 130 },
      { x: 560, top: 642, w: 130 },
      { x: 910, top: 632, w: 170, big: true },
      { x: 1200, top: 674, w: 130 },
      { x: 1490, top: 562, w: 220, big: true },
    ],
    air: { x0: 120, x1: 1500, y0: 260, y1: 640 },
    perches: [
      { x: 230, y: 506 }, { x: 250, y: 482 }, { x: 272, y: 514 }, { x: 560, y: 640 }, { x: 920, y: 600 },
      { x: 1480, y: 562 }, { x: 1200, y: 330 }, { x: 900, y: 580 }, { x: 380, y: 580 },
    ],
    animals: [
      { id: 'marienkaefer', name: 'Marienkäfer', kind: 'fly', h: 80, eye: 54, speed: 200, art: ladybug, s: 1.1 },
      { id: 'schmetterling', name: 'Schmetterling', kind: 'fly', h: 104, eye: 78, speed: 160, art: butterfly, s: 1.1 },
      { id: 'biene', name: 'Biene', kind: 'fly', h: 80, eye: 44, speed: 240, art: bee, s: 1.1 },
      { id: 'schnecke', name: 'Schnecke', kind: 'walk', h: 96, eye: 82, speed: 35, hop: 1, freq: 2, art: snail },
      { id: 'regenwurm', name: 'Regenwurm', kind: 'walk', h: 66, eye: 50, speed: 50, hop: 4, freq: 3, tilt: 5, art: worm },
      { id: 'maulwurf', name: 'Maulwurf', kind: 'walk', h: 130, eye: 100, speed: 90, hop: 4, freq: 3.4, art: mole },
      ...extra,
    ],
  });
})();
