/* Baukasten für die Bereiche (Szenen).
 * Jede Szene-Datei ruft FW.scene({...}) auf. Alle Grafiken sind SVG-Text.
 *
 * Koordinaten: Die Szene ist 1600 × 900 groß. Tiere werden um ihren Fußpunkt (0,0)
 * gezeichnet, nach oben sind die y-Werte negativ.
 *
 * Felder einer Szene:
 *   id, name, icon        – Kennung, Anzeigename, Emoji für die Auswahl
 *   bg                    – Hintergrundfarbe der Seite
 *   back                  – SVG hinter den Tieren (Himmel, Stimmungsfigur mit id="mood", Hintergrund)
 *   front                 – SVG vor den versteckten Tieren (Boden und Verstecke)
 *   ground                – Oberkante des Bodens; darunter sind versteckte Tiere unsichtbar
 *   lane                  – [oben, unten]: hier laufen die Tiere
 *   covers                – Verstecke: { x, top, w }
 *   hole                  – optional: Baumhöhle o. Ä. { x, y, rx, ry } nur für Flieger
 *   perches               – Sitzplätze für Flieger: { x, y }
 *   air                   – optional: Bereich zum freien Fliegen/Schwimmen { x0, x1, y0, y1 }
 *   animals               – 6 Tiere: { id, name, icon, kind: 'walk'|'fly'|'swim', h, eye,
 *                            speed, hop, freq, tilt?, s?, lane?, area?, art }
 */
(() => {
  const n = (v) => +(+v).toFixed(1);
  const attrs = (x) => (x ? ' ' + x : '');
  const FW = {
    scenes: [],
    scene(def) { FW.scenes.push(def); },

    c: (cx, cy, r, fill, x) => `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}"${attrs(x)}/>`,
    e: (cx, cy, rx, ry, fill, x) => `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fill}"${attrs(x)}/>`,
    r: (x, y, w, h, rx, fill, xx) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(rx)}" fill="${fill}"${attrs(xx)}/>`,
    p: (d, fill, x) => `<path d="${d}" fill="${fill}"${attrs(x)}/>`,
    s: (d, stroke, w, x) => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${attrs(x)}/>`,
    g: (inner, x) => `<g${attrs(x)}>${inner}</g>`,
    rot: (deg, cx, cy) => `transform="rotate(${deg} ${cx} ${cy})"`,

    /** Zwei blinzelnde Augen mit Glanzpunkt */
    eyes(x1, x2, y, r = 5.5, col = '#2b1d14') {
      return `<g class="blink">${FW.c(x1, y, r, col)}${FW.c(x2, y, r, col)}</g>`
        + FW.c(x1 + r * 0.3, y - r * 0.3, r * 0.33, '#fff') + FW.c(x2 + r * 0.3, y - r * 0.3, r * 0.33, '#fff');
    },
    eye(x, y, r = 5.5, col = '#2b1d14') {
      return `<g class="blink">${FW.c(x, y, r, col)}</g>` + FW.c(x + r * 0.3, y - r * 0.3, r * 0.33, '#fff');
    },
    cheeks(x1, x2, y, r = 8, col = '#f2a5a5') {
      return FW.c(x1, y, r, col, 'opacity=".55"') + FW.c(x2, y, r, col, 'opacity=".55"');
    },

    /** Gesicht der Stimmungsfigur: ruhig = Lächeln, laut = erschrockener O-Mund.
     *  sleepy: ruhig mit geschlossenen Augen (z. B. Mond) */
    face(r, { ink = '#5a3a1a', sleepy = false, cheeks = true } = {}) {
      const ex = r * 0.32, ey = -r * 0.12, er = r * 0.11;
      const calmEyes = sleepy
        ? FW.s(`M${-ex - er} ${ey} Q${-ex} ${ey + er} ${-ex + er} ${ey} M${ex - er} ${ey} Q${ex} ${ey + er} ${ex + er} ${ey}`, ink, r * 0.07)
        : FW.e(-ex, ey, er * 0.8, er, ink) + FW.e(ex, ey, er * 0.8, er, ink);
      const loudEyes = FW.c(-ex, ey, er * 1.3, '#fff') + FW.c(ex, ey, er * 1.3, '#fff')
        + FW.c(-ex, ey, er * 0.7, ink) + FW.c(ex, ey, er * 0.7, ink);
      return (cheeks ? FW.cheeks(-r * 0.55, r * 0.55, r * 0.25, r * 0.16, '#ff9e7a') : '')
        + FW.g(calmEyes + FW.s(`M${-r * 0.34} ${r * 0.25} Q0 ${r * 0.6} ${r * 0.34} ${r * 0.25}`, ink, r * 0.085), 'class="calm"')
        + FW.g(loudEyes + FW.e(0, r * 0.38, r * 0.16, r * 0.2, ink), 'class="loud"');
    },

    /** Blume (für Wiesen) */
    flower(x, y, col, r = 9) {
      let out = '';
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        out += FW.c(Math.cos(a) * r * 1.4, Math.sin(a) * r * 1.4, r, col);
      }
      return FW.g(out + FW.c(0, 0, r * 0.75, '#ffd23f'), `transform="translate(${x} ${y})"`);
    },
    /** Busch aus Kreisen */
    bush(x, y, size, col = '#3f8f3f', light = '#4ea54b', berries = '') {
      const k = size / 60;
      let out = FW.c(x - 55 * k, y + 16 * k, 56 * k, col) + FW.c(x, y, 62 * k, col) + FW.c(x + 60 * k, y + 18 * k, 52 * k, col);
      out += FW.c(x - 30 * k, y - 12 * k, 26 * k, light) + FW.c(x + 36 * k, y - 6 * k, 22 * k, light);
      if (berries) out += FW.c(x - 40 * k, y + 20 * k, 7 * k, berries) + FW.c(x + 10 * k, y - 30 * k, 7 * k, berries) + FW.c(x + 70 * k, y + 10 * k, 7 * k, berries);
      return out;
    },
    cloud(x, y, k = 1, fill = '#fff', cls = 'cloud') {
      return FW.g(FW.e(x, y, 80 * k, 34 * k, fill) + FW.e(x + 50 * k, y - 20 * k, 56 * k, 38 * k, fill) + FW.e(x - 50 * k, y - 12 * k, 44 * k, 30 * k, fill), `class="${cls}"`);
    },
  };
  window.FW = FW;
})();
