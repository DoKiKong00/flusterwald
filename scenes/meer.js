/* Bereich: Unter dem Meer */
(() => {
  const { c, e, p, s, g, r, eyes, eye, cheeks, face } = FW;

  // Stimmungsfigur: Seestern
  const star = (() => {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? 34 : 78;
      d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ' ' + (Math.sin(a) * rr).toFixed(1) + ' ';
    }
    return d + 'Z';
  })();
  const mood = `
  <g id="mood" transform="translate(200 170)">
    <g class="shake-me">
      ${p(star, '#ff8a4c', 'stroke="#f06a2a" stroke-width="10" stroke-linejoin="round"')}
      ${c(0, -40, 4, '#ffd0a8')}${c(30, 20, 4, '#ffd0a8')}${c(-30, 20, 4, '#ffd0a8')}${c(40, -14, 4, '#ffd0a8')}${c(-40, -14, 4, '#ffd0a8')}
      ${face(40, { ink: '#6a2a10' })}
    </g>
    <g class="loud">${c(60, -60, 10, 'none', 'stroke="#fff" stroke-width="4"')}${c(84, -96, 7, 'none', 'stroke="#fff" stroke-width="3"')}${c(70, -126, 5, 'none', 'stroke="#fff" stroke-width="3"')}</g>
  </g>`;

  const weed = (x, h, col, cls = 'sway') => g(s(`M${x} 760 Q${x - 30} ${760 - h * 0.3} ${x} ${760 - h * 0.55} Q${x + 30} ${760 - h * 0.8} ${x} ${760 - h}`, col, 14), `class="${cls}"`);
  const bubbles = [...Array(9)].map((_, i) => c(80 + i * 180, 760 - (i % 3) * 40, 6 + (i % 3) * 3, 'none',
    `stroke="#d6f4ff" stroke-width="3" class="bubble ${['', 'd2', 'd3'][i % 3]}"`)).join('');

  const back = `
  <defs>
    <linearGradient id="meer-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fd0f0"/><stop offset=".6" stop-color="#1f8fc8"/><stop offset="1" stop-color="#16679e"/></linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#meer-w)"/>
  <!-- Lichtstrahlen -->
  <g fill="#fff" opacity=".12">${p('M300 0 L420 0 L620 760 L480 760Z', '#fff')}${p('M800 0 L880 0 L1040 760 L940 760Z', '#fff')}${p('M1250 0 L1340 0 L1480 760 L1380 760Z', '#fff')}</g>
  ${s('M0 30 Q50 14 100 30 T200 30 T300 30 T400 30 T500 30 T600 30 T700 30 T800 30 T900 30 T1000 30 T1100 30 T1200 30 T1300 30 T1400 30 T1500 30 T1600 30', '#c9f1ff', 6, 'opacity=".7"')}
  ${mood}
  <!-- Hintergrund-Felsen und Pflanzen -->
  ${p('M0 720 Q120 600 260 680 Q360 620 470 700 L470 760 L0 760Z', '#1b5f8f', 'opacity=".55"')}
  ${p('M1000 720 Q1150 590 1300 690 Q1420 630 1600 690 L1600 760 L1000 760Z', '#1b5f8f', 'opacity=".55"')}
  ${weed(420, 300, '#2f9a6a')}${weed(700, 220, '#3fb07a', 'sway d2')}${weed(1080, 260, '#2f9a6a', 'sway d2')}${weed(1370, 200, '#3fb07a')}
  ${bubbles}`;

  const front = `
  <path d="M0 720 Q400 700 800 724 T1600 716 V900 H0Z" fill="#f2d9a0"/>
  <path d="M0 760 Q400 740 800 764 T1600 756 V900 H0Z" fill="#e8c985"/>
  ${c(180, 820, 6, '#fff3d8')}${c(640, 850, 5, '#fff3d8')}${c(1120, 830, 6, '#fff3d8')}${c(1500, 860, 5, '#fff3d8')}
  <!-- Korallen -->
  <g>${s('M180 740 L170 650 M170 680 L130 630 M176 700 L215 640 M215 640 L240 600 M215 650 L250 660', '#ff6f91', 22)}
     ${s('M290 740 L300 660 M300 690 L330 640 M300 670 L270 630', '#ffa64d', 20)}</g>
  <!-- Felsen -->
  ${p('M460 760 Q470 650 560 630 Q660 640 680 760Z', '#5b6e8a')}${p('M500 700 Q540 660 580 668', 'none', 'stroke="#71849f" stroke-width="10" stroke-linecap="round"')}
  <!-- Schiffswrack -->
  ${p('M760 760 L780 640 Q900 610 1040 640 L1060 760Z', '#8a5a33')}
  ${r(880, 520, 16, 130, 4, '#74482a', FW.rot(-8, 888, 585))}
  ${p('M890 530 L960 560 L892 600Z', '#e8dcc0', 'opacity=".85"')}
  ${c(830, 690, 16, '#2e1a0e')}${c(900, 690, 16, '#2e1a0e')}${c(970, 690, 16, '#2e1a0e')}
  ${s('M790 660 H1030', '#6b4226', 6)}
  <!-- große Muschel -->
  ${p('M1180 760 Q1180 650 1260 640 Q1340 650 1340 760Z', '#f7c7d9')}
  ${s('M1200 740 L1240 660 M1230 750 L1255 650 M1290 750 L1268 650 M1320 740 L1282 660', '#e79ab7', 6)}
  <!-- Seetang-Wald -->
  ${weed(1440, 300, '#2a8a5a')}${weed(1490, 260, '#3fb07a', 'sway d2')}${weed(1540, 320, '#2a8a5a')}${weed(1580, 240, '#3fb07a', 'sway d2')}
  ${e(1510, 750, 110, 26, '#2a8a5a')}`;

  const fish = `
  <g class="tail">${p('M-40 -40 L-80 -70 L-74 -40 L-80 -10Z', '#ffb02e')}</g>
  ${e(0, -40, 48, 34, '#ffd23f')}
  ${p('M-14 -72 Q4 -96 20 -70Z', '#ffb02e')}
  ${s('M-10 -70 Q-18 -40 -10 -10 M10 -72 Q2 -40 10 -8', '#ffffff', 8, 'opacity=".8"')}
  <g class="fin">${p('M0 -30 Q-10 -12 6 -14Z', '#ffb02e')}</g>
  ${c(26, -48, 10, '#fff')}${eye(28, -48, 6)}${s('M34 -28 Q40 -26 44 -32', '#a86a10', 3)}`;

  const octo = `
  ${[-48, -28, -8, 12, 32, 52].map((x, i) => s(`M${x * 0.7} -50 Q${x} -20 ${x * 0.9} 0 Q${x * 1.2} 10 ${x * 1.3} -6`, '#a065d8', 16, i % 2 ? 'class="sway"' : 'class="sway d2"')).join('')}
  ${e(0, -100, 58, 64, '#b07ae6')}
  ${e(-20, -130, 14, 10, '#c49af0')}${c(36, -110, 6, '#9452cc')}${c(-40, -84, 5, '#9452cc')}
  ${c(-18, -90, 13, '#fff')}${c(18, -90, 13, '#fff')}${eyes(-16, 20, -90, 7)}
  ${cheeks(-34, 34, -74, 8, '#ff9ec4')}${s('M-10 -70 Q0 -62 10 -70', '#6a2a8a', 4)}`;

  const crab = `
  ${s('M-30 -20 L-56 0 M-20 -16 L-44 4 M30 -20 L56 0 M20 -16 L44 4', '#d9452a', 7)}
  ${s('M-40 -40 Q-70 -50 -72 -76 M40 -40 Q70 -50 72 -76', '#e5583a', 10)}
  ${p('M-72 -76 Q-96 -96 -80 -106 Q-74 -94 -64 -96 Q-58 -110 -72 -112 Q-50 -108 -60 -84Z', '#e5583a')}
  ${p('M72 -76 Q96 -96 80 -106 Q74 -94 64 -96 Q58 -110 72 -112 Q50 -108 60 -84Z', '#e5583a')}
  ${e(0, -36, 50, 30, '#ef6a46')}
  ${s('M-12 -60 L-16 -82 M12 -60 L16 -82', '#e5583a', 6)}
  ${c(-16, -86, 10, '#fff')}${c(16, -86, 10, '#fff')}${eyes(-15, 17, -86, 5.5)}
  ${s('M-12 -32 Q0 -22 12 -32', '#9a2a12', 4)}${cheeks(-30, 30, -36, 6, '#ffb3a0')}`;

  const seahorse = `
  ${s('M-6 -10 Q-30 -10 -24 6 Q-14 14 -6 4', '#f0b028', 9)}
  ${p('M-10 -10 Q-30 -60 -6 -96 Q8 -112 -2 -128 Q20 -130 26 -112 Q30 -90 12 -78 Q22 -50 10 -10Z', '#ffc93c')}
  ${p('M-2 -128 Q-10 -150 8 -146 Q16 -136 26 -112Z', '#ffc93c')}
  ${p('M22 -120 L52 -112 L50 -102 L22 -106Z', '#ffc93c')}
  ${s('M-6 -136 L-14 -148 M2 -140 L0 -154 M10 -138 L16 -150', '#f0a020', 5)}
  <g class="fin">${p('M-22 -60 Q-44 -64 -40 -44 Q-30 -46 -20 -40Z', '#ffe08a')}</g>
  ${s('M0 -70 H14 M-4 -56 H12 M-6 -42 H10 M-4 -28 H8', '#f0a020', 3)}
  ${c(12, -118, 8, '#fff')}${eye(13, -118, 5)}${c(4, -102, 5, '#ff9e7a', 'opacity=".6"')}`;

  const turtle = `
  <g class="fin">${e(-50, -10, 26, 10, '#7cc36a', FW.rot(30, -50, -10))}${e(40, -8, 26, 10, '#7cc36a', FW.rot(-30, 40, -8))}</g>
  ${e(-70, -30, 14, 7, '#7cc36a')}
  ${e(-4, -44, 66, 40, '#3f8f4f')}
  ${p('M-48 -50 L-24 -74 L8 -74 L30 -54 L8 -30 L-24 -30Z', '#57a85e')}${s('M-24 -74 L-24 -30 M8 -74 L8 -30 M-48 -50 L30 -54', '#3f8f4f', 4)}
  ${e(-4, -14, 60, 10, '#d9c27a')}
  ${c(72, -50, 26, '#8ed37a')}${c(80, -56, 9, '#fff')}${eye(82, -56, 5)}${s('M80 -40 Q88 -36 94 -42', '#2f6a2a', 3)}${c(68, -42, 5, '#ff9e7a', 'opacity=".55"')}`;

  const whale = `
  <g class="tail">${p('M-110 -70 Q-150 -120 -170 -110 Q-150 -90 -150 -70 Q-160 -40 -176 -36 Q-140 -30 -110 -56Z', '#4a8fd8')}</g>
  ${p('M-120 -60 Q-120 -150 10 -150 Q120 -150 120 -60 Q120 -6 10 -6 Q-80 -6 -120 -60Z', '#5aa2e8')}
  ${p('M-80 -40 Q10 -6 110 -46 Q110 -10 10 -10 Q-60 -10 -80 -40Z', '#d4ecff')}
  ${s('M10 -152 Q0 -186 -14 -196 M10 -152 Q16 -190 30 -198 M10 -152 L10 -200', '#bfe4ff', 6)}
  <g class="fin">${p('M-6 -40 Q-30 -10 -14 -6 Q0 -18 6 -36Z', '#4a8fd8')}</g>
  ${c(70, -90, 14, '#fff')}${eye(72, -90, 8)}${s('M80 -56 Q100 -50 114 -62', '#2a5a9a', 4)}${c(86, -70, 9, '#ff9ec4', 'opacity=".5"')}`;

  FW.scene({
    id: 'meer', name: 'Meer', icon: '🐠', bg: '#1f8fc8',
    back, front,
    ground: 722, lane: [775, 815],
    covers: [
      { x: 220, top: 610, w: 120 },
      { x: 570, top: 632, w: 140 },
      { x: 910, top: 600, w: 220, big: true },
      { x: 1260, top: 645, w: 110 },
      { x: 1505, top: 470, w: 140, big: true },
    ],
    air: { x0: 80, x1: 1520, y0: 230, y1: 620 },
    perches: [],
    animals: [
      { id: 'fisch', name: 'Fisch', icon: '🐠', kind: 'swim', h: 80, eye: 48, speed: 220, art: fish },
      { id: 'krake', name: 'Krake', icon: '🐙', kind: 'swim', h: 165, eye: 90, speed: 120, art: octo },
      { id: 'krabbe', name: 'Krabbe', icon: '🦀', kind: 'walk', h: 110, eye: 86, speed: 110, hop: 2, freq: 6, tilt: 6, art: crab },
      { id: 'seepferdchen', name: 'Seepferdchen', icon: '🐴', kind: 'swim', h: 150, eye: 118, speed: 90, art: seahorse },
      { id: 'schildkroete', name: 'Schildkröte', icon: '🐢', kind: 'swim', h: 90, eye: 56, speed: 130, art: turtle },
      { id: 'wal', name: 'Wal', icon: '🐳', kind: 'swim', h: 160, eye: 90, speed: 110, art: whale, big: true, s: 0.95 },
    ],
  });
})();
