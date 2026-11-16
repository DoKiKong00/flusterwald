/* Bereich: Teich */
(() => {
  const { c, e, p, s, g, r, eyes, eye, cheeks, face, flower } = FW;

  const reeds = (x, y, n, h, cls) => {
    let out = '';
    for (let i = 0; i < n; i++) {
      const bx = x + (i - n / 2) * 22, hh = h * (0.7 + 0.3 * ((i * 7) % 5) / 4);
      out += s(`M${bx} ${y} Q${bx + 8} ${y - hh * 0.5} ${bx + (i % 2 ? 10 : -6)} ${y - hh}`, i % 2 ? '#5a9a3a' : '#4a8a30', 9);
      if (i % 2 === 0) out += e(bx - 4, y - hh + 26, 9, 26, '#7a4a2a');
    }
    return g(out, `class="${cls}"`);
  };
  const lily = (x, y, k = 1) => p(`M${x} ${y} L${x + 40 * k} ${y - 8 * k} A${44 * k} ${16 * k} 0 1 0 ${x + 40 * k} ${y + 8 * k}Z`, '#4aa24a');

  // Stimmungsfigur: Wolke. Laut: dunkel und es regnet.
  const mood = `
  <g id="mood" transform="translate(230 170)">
    <g class="calm">${e(0, 10, 100, 50, '#fff')}${c(-40, -14, 50, '#fff')}${c(30, -24, 60, '#fff')}</g>
    <g class="loud">${e(0, 10, 100, 50, '#9aa8b8')}${c(-40, -14, 50, '#9aa8b8')}${c(30, -24, 60, '#9aa8b8')}
      ${s('M-50 70 L-58 100 M-10 76 L-18 110 M30 70 L22 104 M70 66 L62 96', '#5a9ad8', 6)}</g>
    <g transform="translate(0 4)">${face(56, { ink: '#3a4a6a' })}</g>
  </g>`;

  const back = `
  <defs>
    <linearGradient id="teich-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ed6f6"/><stop offset="1" stop-color="#e6f8ec"/></linearGradient>
    <linearGradient id="teich-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cc6e8"/><stop offset="1" stop-color="#3a9ac8"/></linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#teich-sky)"/>
  ${mood}
  ${FW.cloud(820, 150, 0.7)}
  <path d="M0 600 Q300 540 640 600 T1300 580 T1600 590 V900 H0Z" fill="#a6dc8a"/>
  <path d="M0 650 Q400 610 800 650 T1600 640 V900 H0Z" fill="#86cc6a"/>
  ${FW.bush(1350, 640, 40, '#5fae5a', '#6fbe6a')}${FW.bush(120, 640, 36, '#5fae5a', '#6fbe6a')}
  <!-- Teich -->
  ${e(820, 700, 520, 70, '#5aaedc')}${e(820, 696, 500, 60, 'url(#teich-w)')}
  ${s('M520 690 q20 -8 40 0 M900 680 q20 -8 40 0 M1100 704 q20 -8 40 0', '#c8eefc', 4)}
  ${lily(640, 704)}${lily(760, 684, 0.8)}${lily(1040, 700, 0.9)}${c(676, 700, 9, '#ff9ec4')}${c(1072, 696, 8, '#fff')}`;

  const front = `
  <rect y="740" width="1600" height="160" fill="#7cc35a"/>
  <path d="M0 740 Q300 724 520 742 Q820 770 1120 742 Q1400 724 1600 740 V760 H0Z" fill="#6ab04a"/>
  <rect y="700" width="300" height="60" fill="#7cc35a"/><rect x="1340" y="700" width="260" height="60" fill="#7cc35a"/>
  ${reeds(230, 760, 9, 260, 'sway')}
  <!-- Steine -->
  ${e(520, 740, 70, 44, '#9aa4ac')}${e(600, 752, 54, 34, '#8a949c')}${e(504, 726, 30, 12, '#b4bcc4')}
  <!-- Biberburg aus Ästen -->
  ${p('M800 770 Q820 640 920 612 Q1020 640 1040 770Z', '#8a6040')}
  ${s('M820 740 L1020 700 M830 700 L1010 740 M860 660 L990 690 M850 690 L980 650 M900 630 L950 720', '#6a4428', 9)}
  ${p('M890 770 Q890 730 920 728 Q950 730 950 770Z', '#3a2414')}
  <!-- Busch -->
  ${FW.bush(1200, 730, 50, '#3f8f3f', '#4ea54b', '#c84a8a')}
  ${reeds(1470, 760, 10, 240, 'sway d2')}
  ${flower(380, 850, '#ffd23f', 8)}${flower(720, 870, '#fff', 8)}${flower(1100, 860, '#c890ff', 8)}`;

  const frog = `
  ${e(-34, -8, 22, 10, '#4aa23a')}${e(34, -8, 22, 10, '#4aa23a')}
  ${e(0, -36, 48, 32, '#5ab84a')}${e(0, -28, 30, 20, '#c8e8a0')}
  ${c(-24, -70, 18, '#5ab84a')}${c(24, -70, 18, '#5ab84a')}${c(-24, -72, 12, '#fff')}${c(24, -72, 12, '#fff')}
  ${eyes(-23, 25, -72, 6.5)}
  ${s('M-24 -46 Q0 -32 24 -46', '#2a6a1a', 4)}${cheeks(-34, 34, -48, 7, '#ff9ec4')}`;

  const duck = `
  ${s('M-8 0 V-14 M10 0 V-14', '#ff9a2a', 5)}${e(-12, -2, 10, 5, '#ff9a2a')}${e(14, -2, 10, 5, '#ff9a2a')}
  ${p('M-56 -50 Q-70 -70 -60 -78 Q-50 -64 -40 -60Z', '#8a6a4a')}
  ${e(-6, -40, 50, 28, '#a07a54')}
  <g class="wiggle">${e(-14, -42, 28, 16, '#8a6440')}${s('M-26 -40 h24', '#3a6ad8', 5)}</g>
  ${c(30, -80, 24, '#2a8a4a')}${s('M12 -60 Q30 -54 44 -62', '#fff', 5)}
  ${p('M48 -84 Q70 -80 70 -74 Q60 -70 48 -74Z', '#ffb02a')}
  ${eye(36, -86, 4.5)}${c(30, -72, 5, '#ff9ec4', 'opacity=".5"')}`;

  const dragonfly = `
  <g class="wings2">${e(-20, -46, 30, 9, '#cfeeff', FW.rot(-20, -20, -46) + ' opacity=".8" stroke="#8ac8e8" stroke-width="2"')}${e(20, -46, 30, 9, '#cfeeff', FW.rot(20, 20, -46) + ' opacity=".8" stroke="#8ac8e8" stroke-width="2"')}
    ${e(-18, -36, 24, 7, '#cfeeff', FW.rot(20, -18, -36) + ' opacity=".8" stroke="#8ac8e8" stroke-width="2"')}${e(18, -36, 24, 7, '#cfeeff', FW.rot(-20, 18, -36) + ' opacity=".8" stroke="#8ac8e8" stroke-width="2"')}</g>
  ${r(-60, -44, 56, 8, 4, '#2a9ad8')}${s('M-50 -40 v0 M-38 -40 v0', '#1a6aa8', 2)}
  ${e(4, -40, 12, 9, '#2ab0e8')}
  ${c(20, -42, 11, '#3ac0f0')}${c(24, -46, 6, '#fff')}${eye(25, -46, 3.5)}`;

  const beaver = `
  <g class="tail">${e(-60, -12, 34, 14, '#6a4a3a', FW.rot(-10, -60, -12))}${s('M-80 -14 L-44 -10 M-74 -6 L-48 -18', '#5a3a2a', 2)}</g>
  ${r(-30, -18, 16, 20, 6, '#6a4428')}${r(16, -18, 16, 20, 6, '#6a4428')}
  ${e(0, -46, 46, 42, '#9a6a44')}${e(4, -40, 26, 28, '#c49a74')}
  ${c(-30, -122, 10, '#8a5a38')}${c(30, -122, 10, '#8a5a38')}
  ${c(0, -98, 36, '#a87650')}
  ${e(0, -84, 18, 13, '#d4b08a')}${e(0, -90, 8, 6, '#3a2a1a')}${r(-7, -76, 14, 14, 2, '#fffaf0')}${s('M0 -76 V-62', '#d4c4a4', 1.5)}
  ${eyes(-14, 14, -106, 5)}${cheeks(-26, 26, -90, 6, '#f2a5a5')}`;

  const stork = `
  <g class="legs">${s('M-10 0 L-8 -90', '#e8502a', 6)}</g>${s('M10 0 L8 -90', '#e8502a', 6)}
  ${e(-6, -126, 54, 36, '#fff', 'stroke="#d8dee6" stroke-width="2"')}
  ${p('M-60 -130 Q-40 -110 10 -108 Q-20 -96 -64 -112Z', '#2b2b2b')}
  ${p('M24 -150 Q28 -200 40 -226 L54 -222 Q44 -190 42 -140Z', '#fff', 'stroke="#d8dee6" stroke-width="2"')}
  ${c(48, -236, 20, '#fff', 'stroke="#d8dee6" stroke-width="2"')}
  ${p('M62 -240 L120 -228 L62 -226Z', '#e8502a')}
  ${eye(52, -242, 4.5)}${c(46, -226, 5, '#ff9ec4', 'opacity=".5"')}`;

  const swan = `
  ${p('M-70 -40 Q-80 -80 -50 -76 Q-20 -60 -10 -40Z', '#f4f4f4')}
  ${e(-10, -36, 64, 32, '#fff', 'stroke="#d8dee6" stroke-width="2"')}
  <g class="wiggle">${p('M-50 -50 Q-30 -86 20 -60 Q-10 -48 -50 -50Z', '#f4f6f8', 'stroke="#d8dee6" stroke-width="2"')}</g>
  ${s('M36 -50 Q60 -90 40 -130 Q30 -150 50 -164', '#fff', 18)}
  ${c(56, -166, 18, '#fff', 'stroke="#d8dee6" stroke-width="2"')}
  ${p('M70 -170 L96 -160 L70 -154Z', '#ff8a2a')}${p('M64 -172 L72 -170 L72 -156 L64 -158Z', '#2b2b2b')}
  ${eye(58, -172, 4)}${c(52, -158, 5, '#ff9ec4', 'opacity=".5"')}`;

  FW.scene({
    id: 'teich', name: 'Teich', icon: '🐸', bg: '#8ed6f6',
    back, front,
    under: '#7cc35a',
    ground: 740, lane: [782, 815],
    covers: [
      { x: 230, top: 540, w: 180, big: true },
      { x: 545, top: 700, w: 120 },
      { x: 920, top: 616, w: 200, big: true },
      { x: 1200, top: 672, w: 130 },
      { x: 1470, top: 560, w: 190, big: true },
    ],
    perches: [
      { x: 640, y: 700 }, { x: 760, y: 682 }, { x: 1040, y: 696 }, { x: 520, y: 700 }, { x: 920, y: 614 },
      { x: 200, y: 520 }, { x: 1480, y: 540 },
    ],
    air: { x0: 120, x1: 1500, y0: 300, y1: 640 },
    animals: [
      { id: 'frosch', name: 'Frosch', icon: '🐸', kind: 'walk', h: 92, eye: 72, speed: 180, hop: 40, freq: 2, art: frog },
      { id: 'ente', name: 'Ente', icon: '🦆', kind: 'walk', h: 110, eye: 86, speed: 100, hop: 2, freq: 4, tilt: 8, art: duck },
      { id: 'libelle', name: 'Libelle', icon: '🪰', kind: 'fly', h: 60, eye: 46, speed: 260, art: dragonfly, s: 1.2 },
      { id: 'biber', name: 'Biber', icon: '🦫', kind: 'walk', h: 134, eye: 106, speed: 100, hop: 4, freq: 3.4, art: beaver },
      { id: 'storch', name: 'Storch', icon: '🪶', kind: 'walk', h: 260, eye: 242, speed: 90, hop: 3, freq: 1.6, art: stork, big: true },
      { id: 'schwan', name: 'Schwan', icon: '🦢', kind: 'walk', h: 186, eye: 172, speed: 80, hop: 2, freq: 2, tilt: 3, art: swan, big: true },
    ],
  });
})();
