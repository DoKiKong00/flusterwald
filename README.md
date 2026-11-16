# 🌳 Flüsterwald

Eine Lautstärke-Ampel für Kita und Grundschule (1./2. Klasse).
Wenn es im Raum leise ist, trauen sich nach und nach die Tiere heraus.
Welches Tier kommt und aus welchem Versteck, ist jedes Mal zufällig. Erst lugen die Tiere
vorsichtig hervor, dann laufen, hoppeln, fliegen oder schwimmen sie herum.
Wird es laut, flitzen sie ins nächste Versteck. Sind alle sechs Tiere da, gibt es einen Stern.

## Bereiche

| Bereich | Tiere | Stimmungsfigur |
|---|---|---|
| 🌳 Wald | Hase, Igel, Eichhörnchen, Fuchs, Eule, Reh | Sonne |
| 🚜 Bauernhof | Huhn, Schwein, Schaf, Kuh, Katze, Schwalbe | Hahn auf dem Dach |
| 🐠 Meer | Fisch, Krake, Krabbe, Seepferdchen, Schildkröte, Wal | Seestern |
| 🌙 Nacht | Fledermaus, Waschbär, Dachs, Maus, Uhu, Glühwürmchen | Mond (schläft, solange es leise ist) |
| 🦁 Savanne | Löwe, Giraffe, Zebra, Elefant, Erdmännchen, Papagei | Sonne |
| ❄️ Schnee | Pinguin, Eisbär, Robbe, Polarfuchs, Schneehase, Schneeeule | Schneemann |
| 🐸 Teich | Frosch, Ente, Libelle, Biber, Storch, Schwan | Wolke (regnet bei Lärm) |
| 🌷 Garten | Marienkäfer, Schmetterling, Biene, Schnecke, Regenwurm, Maulwurf | Sonnenblume |
| 🐒 Dschungel | Affe, Tukan, Faultier, Tiger, Schlange, Chamäleon | Sonne |
| 🚀 Weltall | Astronauten-Katze, Astronauten-Hund, Alien, Roboter, UFO, Rakete | Saturn |

Den Bereich wählt man auf dem Startbildschirm, über den Knopf 🗺 (Taste B) oder in den Einstellungen.
Dort lässt sich auch einstellen, dass bei jedem Start ein anderer Bereich kommt.

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
| B | Bereich wählen |
| L (gedrückt halten) | „Laut“ simulieren (nur Vorschau ohne Mikrofon) |

Einstellungen: Bildschirm nicht abdunkeln/ausschalten (standardmäßig an), Grenze (wie leise muss es sein), „Raum einmessen“, Tempo (Sekunden pro Tier),
ein Tier oder alle Tiere verstecken sich bei Lärm, Lautstärke-Balken ausblenden.

### Bildschirm bleibt an

Solange Flüsterwald läuft, verhindert die App, dass der Bildschirm dunkel wird oder ausgeht
(Einstellung „Bildschirm nicht abdunkeln oder ausschalten“). Das funktioniert in Chrome, Edge
und Safari ab iPadOS 16.4. Klappt es auf einem Gerät nicht, zeigt die App einen Hinweis; dann
in den Geräte-Einstellungen die automatische Sperre ausschalten
(iPad: Einstellungen → Anzeige & Helligkeit → Automatische Sperre → Nie).

### Bildschirmgrößen

Die Szene passt sich jedem Format an (Beamer, Whiteboard, Laptop, Tablet hoch/quer, Handy):
Es wird nichts Wichtiges abgeschnitten, stattdessen werden Himmel und Boden verlängert.

## Lokal starten

Das Mikrofon funktioniert nur über `https://` oder `http://localhost`:

```bash
npx serve .          # oder: python3 -m http.server 8000
```

Dann `http://localhost:3000` (bzw. `:8000`) öffnen.

## Aufbau

- `index.html` – Szene (SVG, alle Grafiken selbst gezeichnet) und Oberfläche
- `style.css` – Gestaltung und Animationen
- `app.js` – Pegelmessung (Web Audio API) und Spiellogik (für alle Bereiche gleich)
- `scenes/_kit.js` – Baukasten für Bereiche (Formen, Augen, Gesichter); erklärt alle Felder einer Szene
- `scenes/*.js` – je ein Bereich mit Hintergrund, Verstecken und sechs Tieren.
  Neuer Bereich: Datei anlegen, in `index.html` und in die Liste in `sw.js` eintragen.
- `manifest.webmanifest`, `icons/` – App-Name und -Symbole
- `sw.js` – Service Worker für den Offline-Betrieb.
  **Wichtig:** Bei jeder Änderung an den Dateien `VERSION` in `sw.js` hochzählen,
  sonst bekommen installierte Apps das Update nicht.

Kein Build-Schritt nötig.
