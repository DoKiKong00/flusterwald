# 🌳 Flüsterwald

Eine Lautstärke-Ampel für Kita und Grundschule (1./2. Klasse).
Wenn es im Raum leise ist, trauen sich nach und nach die Waldtiere heraus:
Hase, Igel, Eichhörnchen, Fuchs, Eule und Reh. Welches Tier kommt und aus welchem
Versteck, ist jedes Mal zufällig. Erst lugen die Tiere vorsichtig hervor, dann laufen,
hoppeln und fliegen sie durch den Wald. Wird es laut, flitzen sie ins nächste Versteck.
Sind alle sechs Tiere da, gibt es einen Stern.

## Datenschutz

- Das Mikrofon misst nur den Pegel – es wird **nichts aufgenommen, gespeichert oder verschickt**.
- Kein Konto, keine Werbung, kein Tracking, kein Server. Alles läuft im Browser.
- Gespeichert werden nur die Einstellungen und die Sterne des Tages (im Browser, `localStorage`).

## Als App installieren (funktioniert dann auch offline)

Seite einmal mit Internet öffnen: **https://dokikong00.github.io/flusterwald/**

- **Windows-Laptop / Whiteboard (Chrome oder Edge):** Auf dem Startbildschirm auf
  „📲 Als App installieren“ klicken – oder rechts in der Adressleiste auf das Installieren-Symbol.
- **iPad (Safari):** Teilen ⎙ → „Zum Home-Bildschirm“.
- **Android-Tablet (Chrome):** Menü ⋮ → „App installieren“.

Danach startet Flüsterwald über das eigene Symbol, ohne Browserleiste und ohne Internet.
Updates werden beim nächsten Start mit Internet automatisch im Hintergrund geladen.

## Bedienung

| Taste | Funktion |
|---|---|
| Leertaste | Pause / weiter |
| R | Neu starten |
| F | Vollbild |
| E | Einstellungen |
| L (gedrückt halten) | „Laut“ simulieren (nur Vorschau ohne Mikrofon) |

Einstellungen: Grenze (wie leise muss es sein), „Raum einmessen“, Tempo (Sekunden pro Tier),
ein Tier oder alle Tiere verstecken sich bei Lärm, Lautstärke-Balken ausblenden.

## Lokal starten

Das Mikrofon funktioniert nur über `https://` oder `http://localhost`:

```bash
npx serve .          # oder: python3 -m http.server 8000
```

Dann `http://localhost:3000` (bzw. `:8000`) öffnen.

## Aufbau

- `index.html` – Szene (SVG, alle Grafiken selbst gezeichnet) und Oberfläche
- `style.css` – Gestaltung und Animationen
- `app.js` – Pegelmessung (Web Audio API) und Spiellogik
- `manifest.webmanifest`, `icons/` – App-Name und -Symbole
- `sw.js` – Service Worker für den Offline-Betrieb.
  **Wichtig:** Bei jeder Änderung an den Dateien `VERSION` in `sw.js` hochzählen,
  sonst bekommen installierte Apps das Update nicht.

Kein Build-Schritt nötig.
