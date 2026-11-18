/* Eigene Icons im Buntstift-Stil (statt Emojis).
 * Alle Icons sind 48 × 48 groß und teilen sich einen Filter, der Ränder leicht
 * zittern lässt und die Farbe körnig/strichig macht – wie mit Buntstift gemalt.
 * Verwendung im HTML:  <svg class="ico"><use href="#i-stern"/></svg>
 * Verwendung im JS:    FWIcon('stern')  → gleiches Markup als Text */
(() => {
  const G = '#4a3b33';                 // Graphit-Umriss
  const L = `stroke="${G}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"`;
  const line = (d, col = G, w = 2.6) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const fill = (d, col) => `<path d="${d}" fill="${col}" ${L}/>`;
  const circ = (x, y, r, col, outline = true) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" ${outline ? L : ''}/>`;
  const dot = (x, y, r = 1.8, col = G) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
  // Schraffur: ein paar lockere Buntstiftstriche über einer Fläche
  const hatch = () => ''; // (Schraffur abgeschaltet – die Körnung des Filters reicht)
  const hatchOld = (x0, y0, x1, y1, col, n = 5) => {
    let d = '';
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const ax = x0 + (x1 - x0) * t, ay = y0;
      d += `M${(ax - 6).toFixed(1)} ${(y1).toFixed(1)} L${(ax + 4).toFixed(1)} ${(ay).toFixed(1)} `;
    }
    return `<path d="${d}" fill="none" stroke="${col}" stroke-width="1.3" stroke-linecap="round" opacity=".55"/>`;
  };

  const ICONS = {
    // ---------- Bedienung ----------
    karte: fill('M6 12 L18 7 L30 12 L42 7 V36 L30 41 L18 36 L6 41Z', '#f6e3a1')
      + line('M18 7 V36 M30 12 V41') + hatch(7, 14, 17, 38, '#e8c86a', 3)
      + line('M10 30 Q16 22 22 26 T34 20', '#58a85a', 2.2) + line('M35 15 l5 5 M40 15 l-5 5', '#e2483c', 2.6),
    pause: fill('M13 9 h8 v30 h-8z', '#8fc1e8') + fill('M27 9 h8 v30 h-8z', '#8fc1e8')
      + hatch(13, 10, 21, 38, '#5e9ed2', 3) + hatch(27, 10, 35, 38, '#5e9ed2', 3),
    weiter: fill('M14 8 L38 24 L14 40Z', '#8fd18f') + hatch(15, 12, 30, 36, '#5aaa5a', 4),
    neu: line('M36 15 A14 14 0 1 0 38 28', '#e8913a', 5) + fill('M30 8 L40 15 L29 20Z', '#e8913a'),
    vollbild: line('M8 17 V8 H17 M31 8 H40 V17 M40 31 V40 H31 M17 40 H8 V31', '#6f8fd8', 4.5),
    zahnrad: fill('M24 5 l4 5 l6 -2 l1 6 l6 2 l-2 6 l5 4 l-5 4 l2 6 l-6 2 l-1 6 l-6 -2 l-4 5 l-4 -5 l-6 2 l-1 -6 l-6 -2 l2 -6 l-5 -4 l5 -4 l-2 -6 l6 -2 l1 -6 l6 2Z', '#b9bfcc')
      + hatch(10, 12, 38, 36, '#8f97a8', 6) + circ(24, 24, 6, '#fff7e6'),
    stern: fill('M24 5 L29.5 17.5 L43 18.5 L32.5 27.5 L36 41 L24 33.5 L12 41 L15.5 27.5 L5 18.5 L18.5 17.5Z', '#ffd23f')
      + hatch(12, 16, 36, 36, '#f0a820', 6),
    leise: circ(24, 24, 18, '#ffe08a') + hatch(9, 12, 39, 38, '#f2c24a', 7)
      + line('M15 19 q3 3 6 0 M27 19 q3 3 6 0') + fill('M21 26 h6 v14 q-3 3 -6 0z', '#f2b48a')
      + line('M18 31 q-2 2 0 4 M30 31 q2 2 0 4', G, 2),
    laut: fill('M8 19 h7 l13 -9 v28 l-13 -9 h-7z', '#ef6a4a') + hatch(9, 12, 27, 36, '#c84a2a', 4)
      + line('M33 17 q4 7 0 14 M38 12 q7 12 0 24', '#ef6a4a', 3),
    mikro: fill('M17 6 h14 a7 7 0 0 1 7 7 v9 a7 7 0 0 1 -7 7 h-14 a7 7 0 0 1 -7 -7 v-9 a7 7 0 0 1 7 -7z', '#9aa8c8')
      + line('M13 12 h22 M13 18 h22 M13 24 h22', '#6f7fa8', 1.6) + line('M8 22 q0 13 16 13 q16 0 16 -13 M24 35 v7 M16 42 h16'),
    schloss: line('M15 21 v-6 a9 9 0 0 1 18 0 v6', G, 3.2) + fill('M10 21 h28 v20 h-28z', '#f0c040')
      + hatch(11, 22, 37, 40, '#d49a20', 6) + dot(24, 29, 3) + line('M24 31 v5', G, 3),
    installieren: fill('M14 5 h20 a3 3 0 0 1 3 3 v32 a3 3 0 0 1 -3 3 h-20 a3 3 0 0 1 -3 -3 v-32 a3 3 0 0 1 3 -3z', '#cfe6f5')
      + line('M24 12 v16 M17 22 l7 7 l7 -7', '#3f9a4a', 3.4) + line('M20 38 h8'),
    teilen: line('M15 19 h-4 v22 h26 v-22 h-4') + line('M24 6 v24 M17 13 l7 -7 l7 7', '#4a8ad8', 3.2),
    album: fill('M24 12 Q14 6 5 9 V39 Q14 36 24 41Z', '#fff3d6') + fill('M24 12 Q34 6 43 9 V39 Q34 36 24 41Z', '#fde6b8')
      + line('M9 16 q7 -2 11 1 M9 22 q7 -2 11 1 M9 28 q7 -2 11 1', '#c8a070', 1.6)
      + fill('M33 8 v12 l3 -3 l3 3 v-13z', '#e2483c'),
    ziel: circ(24, 24, 18, '#fff7e6') + circ(24, 24, 12, '#ef6a4a') + circ(24, 24, 6, '#fff7e6') + dot(24, 24, 2.6, '#c83a2a')
      + line('M26 22 L42 6 M36 6 h6 v6', '#6f5a3a', 2.6),
    ok: circ(24, 24, 18, '#8fd18f') + hatch(9, 12, 39, 38, '#5aaa5a', 7) + line('M15 24 l6 7 l12 -14', G, 3.6),
    achtung: fill('M24 6 L43 40 H5Z', '#ffd23f') + hatch(12, 18, 36, 38, '#f0a820', 6) + line('M24 17 v12', G, 3.6) + dot(24, 34, 2.4),
    huch: circ(24, 25, 15, '#ffe08a') + hatch(10, 14, 38, 38, '#f2c24a', 6)
      + circ(20, 22, 3.2, '#fff') + circ(29, 22, 3.2, '#fff') + dot(20, 22, 1.6) + dot(29, 22, 1.6)
      + `<ellipse cx="24.5" cy="31" rx="3" ry="4" fill="${G}"/>`
      + fill('M4 18 q5 -3 7 2 l1 11 q-6 2 -8 -3z', '#f2b48a') + fill('M44 18 q-5 -3 -7 2 l-1 11 q6 2 8 -3z', '#f2b48a'),

    // ---------- Bereiche ----------
    wald: fill('M21 30 h6 v13 h-6z', '#9a6a3a') + circ(24, 19, 14, '#5fb05a') + hatch(11, 8, 37, 32, '#3f8f3f', 7)
      + dot(17, 16, 2.4, '#e2483c') + dot(29, 13, 2.4, '#e2483c') + dot(28, 24, 2.4, '#e2483c'),
    bauernhof: fill('M6 30 V20 h16 l3 -10 h10 v20z', '#5fb05a') + hatch(7, 12, 34, 30, '#3f8f3f', 6)
      + fill('M27 12 h7 v8 h-7z', '#cfe6f5') + line('M38 20 v-8', G, 3)
      + circ(15, 33, 9, '#4a4a54') + circ(15, 33, 3.5, '#f0c040') + circ(36, 36, 6, '#4a4a54') + circ(36, 36, 2.4, '#f0c040'),
    meer: fill('M32 24 L44 14 L42 24 L44 34Z', '#f07a2a') + `<ellipse cx="20" cy="24" rx="15" ry="11" fill="#ff9a3a" ${L}/>`
      + line('M18 14 Q15 24 18 34 M25 14.5 Q23 24 25 33.5', '#fff', 2.8) + fill('M17 13 Q21 6 27 13Z', '#f07a2a')
      + circ(11, 22, 3, '#fff') + dot(11, 22, 1.6) + line('M7 28 q2 1 4 0', G, 1.8),
    nacht: fill('M30 6 A18 18 0 1 0 42 32 A14 14 0 1 1 30 6Z', '#ffe08a') + hatch(8, 10, 34, 42, '#f2c24a', 6)
      + fill('M38 8 l1.5 3.5 l3.5 1.5 l-3.5 1.5 l-1.5 3.5 l-1.5 -3.5 l-3.5 -1.5 l3.5 -1.5z', '#fff3a0'),
    savanne: circ(24, 24, 19, '#d9822a') + hatch(6, 6, 42, 42, '#b8621a', 8) + circ(24, 26, 12, '#f2c06a')
      + dot(20, 23, 2) + dot(28, 23, 2) + fill('M22 28 h4 l-2 3z', '#7a3a1a') + line('M21 33 q3 2 6 0', G, 2)
      + circ(15, 15, 3.5, '#f2c06a') + circ(33, 15, 3.5, '#f2c06a'),
    schnee: line('M24 5 V43 M7.5 14.5 L40.5 33.5 M7.5 33.5 L40.5 14.5', '#5a9ad8', 3.6)
      + line('M19 9 l5 5 l5 -5 M19 39 l5 -5 l5 5 M9 21 l6 0 l-3 -5 M39 27 l-6 0 l3 5 M9 27 l6 0 l-3 5 M39 21 l-6 0 l3 -5', '#5a9ad8', 2.4),
    teich: fill('M6 32 Q6 18 24 18 Q42 18 42 32 Q42 40 24 40 Q6 40 6 32Z', '#6cc45a') + hatch(8, 20, 40, 39, '#4aa23a', 7)
      + circ(15, 16, 6.5, '#6cc45a') + circ(33, 16, 6.5, '#6cc45a') + circ(15, 16, 3.5, '#fff') + circ(33, 16, 3.5, '#fff')
      + dot(15, 16, 1.8) + dot(33, 16, 1.8) + line('M16 30 q8 6 16 0', G, 2.4),
    garten: line('M24 26 V44', '#4a9a3a', 3) + fill('M24 38 q-9 -2 -10 -10 q8 0 10 8z', '#6cc45a') + fill('M24 40 q9 -2 10 -9 q-8 0 -10 7z', '#6cc45a')
      + fill('M14 10 L19 16 L24 7 L29 16 L34 10 V20 Q34 28 24 28 Q14 28 14 20Z', '#ef5a7a') + hatch(15, 11, 33, 27, '#c83a5a', 5),
    dschungel: circ(10, 22, 6, '#9a6a3a') + circ(38, 22, 6, '#9a6a3a') + circ(10, 22, 3, '#f0d0a8', false) + circ(38, 22, 3, '#f0d0a8', false)
      + circ(24, 23, 15, '#9a6a3a') + hatch(10, 9, 38, 37, '#7a4a2a', 6)
      + fill('M15 22 Q15 14 21 15 Q24 18 27 15 Q33 14 33 22 Q34 34 24 35 Q14 34 15 22Z', '#f0d0a8')
      + dot(20, 21, 1.8) + dot(28, 21, 1.8) + line('M20 29 q4 3 8 0', G, 2),
    weltall: fill('M24 4 Q34 12 33 30 H15 Q14 12 24 4Z', '#f4f6fa') + hatch(16, 10, 32, 29, '#c8d0dc', 4)
      + circ(24, 18, 4.5, '#6ab0f0') + fill('M15 24 L8 34 L15 32Z', '#e2483c') + fill('M33 24 L40 34 L33 32Z', '#e2483c')
      + fill('M18 30 h12 l-2 4 h-8z', '#e2483c') + fill('M20 35 Q24 46 28 35Z', '#ffb02a'),
  };

  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
    <defs>
      <filter id="buntstift" x="-12%" y="-12%" width="124%" height="124%">
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="4" result="n1"/>
        <feDisplacementMap in="SourceGraphic" in2="n1" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="wackel"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.12 1.4" numOctaves="2" seed="11" result="n2"/>
        <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.55" result="korn"/>
        <feComposite in="wackel" in2="korn" operator="in"/>
      </filter>
    </defs>
    ${Object.entries(ICONS).map(([n, body]) =>
      `<symbol id="i-${n}" viewBox="0 0 48 48"><g filter="url(#buntstift)" transform="rotate(-2 24 24)">${body}</g></symbol>`).join('')}
  </svg>`;
  document.body.insertAdjacentHTML('afterbegin', sprite);

  window.FWIcon = (name, cls = '') => `<svg class="ico ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
})();
