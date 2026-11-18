# 🌳 Flüsterwald

Eine Lautstärke-Ampel für Kita und Grundschule (1./2. Klasse).
Wenn es im Raum leise ist, trauen sich nach und nach die Tiere heraus – bis zu 30 auf einmal.
Welches Tier kommt und aus welchem Versteck, ist jedes Mal zufällig; Tiere können auch mehrfach
vorkommen, seltene Tiere tauchen nur ab und zu auf. Erst lugen sie vorsichtig hervor, dann laufen,
hoppeln, fliegen oder schwimmen sie herum. Wird es laut, flitzen sie ins nächste Versteck.
Ist die Höchstzahl erreicht, regnen still ein paar Sterne und es gibt einen Tagesstern.

## Bereiche (je 10 Tierarten, insgesamt 100)

| Bereich | Tiere | Stimmungsfigur |
|---|---|---|
| 🌳 Wald | Hase, Igel, Eichhörnchen, Fuchs, Eule, Reh, Wildschwein, Specht, Bär, Wolf* | Sonne |
| 🚜 Bauernhof | Huhn, Schwein, Schaf, Kuh, Katze, Schwalbe, Pferd, Ziege, Gans, Hund | Hahn auf dem Dach |
| 🐠 Meer | Fisch, Krake, Krabbe, Seepferdchen, Schildkröte, Wal, Qualle, Delfin, Hai*, Kugelfisch | Seestern |
| 🌙 Nacht | Fledermaus, Waschbär, Dachs, Maus, Uhu, Glühwürmchen, Nachtfalter, Kröte, Igel, Wolf* | Mond |
| 🦁 Savanne | Löwe, Giraffe, Zebra, Elefant, Erdmännchen, Papagei, Nashorn, Nilpferd, Strauß, Krokodil* | Sonne |
| ❄️ Schnee | Pinguin, Eisbär, Robbe, Polarfuchs, Schneehase, Schneeeule, Rentier, Walross, Husky, Papageitaucher | Schneemann |
| 🐸 Teich | Frosch, Ente, Libelle, Biber, Storch, Schwan, Küken, Eisvogel, Otter, Schildkröte* | Wolke |
| 🌷 Garten | Marienkäfer, Schmetterling, Biene, Schnecke, Regenwurm, Maulwurf, Amsel, Ameise, Raupe, Grashüpfer | Sonnenblume |
| 🐒 Dschungel | Affe, Tukan, Faultier, Tiger, Schlange, Chamäleon, Gorilla*, Kolibri, Pfeilgiftfrosch, Blauer Falter | Sonne |
| 🚀 Weltall | Astronauten-Katze, Astronauten-Hund, Alien, Roboter, UFO, Rakete, Satellit, Komet*, Mondhase, Lila Monster | Saturn |

\* selten

## Sammelalbum

In den Einstellungen (oder mit Taste A) gibt es das Sammelalbum. Jede Tierart, die einmal
herausgekommen ist, erscheint dort farbig mit Zähler; noch nicht entdeckte Tiere sind nur als
Schatten zu sehen. Ein roter Punkt am ⚙-Knopf zeigt, dass ein neues Tier entdeckt wurde.

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
| Leertaste | Pause / weiter (Tiere bewegen sich weiter, es kommen und gehen aber keine) |
| R | Neu starten |
| F | Vollbild |
| E | Einstellungen |
| B | Bereich wählen |
| A | Sammelalbum |
| L (gedrückt halten) | „Laut“ simulieren (nur Vorschau ohne Mikrofon) |

Einstellungen: Sammelalbum, Bereich, Bildschirm nicht abdunkeln/ausschalten (standardmäßig an),
Grenze (wie leise muss es sein), „Raum einmessen“, Tempo (3 Sekunden bis 30 Minuten pro Tier), bei Lärm verstecken
sich ein Tier / einige Tiere / alle Tiere, Höchstzahl (10/20/30), Lautstärke-Balken ausblenden.

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
- `icons.js` – eigene Icons im Buntstift-Stil (statt Emojis), alle mit einem gemeinsamen SVG-Filter
- `app.js` – Pegelmessung (Web Audio API) und Spiellogik (für alle Bereiche gleich)
- `scenes/_kit.js` – Baukasten für Bereiche (Formen, Augen, Gesichter); erklärt alle Felder einer Szene
- `scenes/*.js` – je ein Bereich mit Hintergrund, Verstecken und sechs Tieren.
  Neuer Bereich: Datei anlegen, in `index.html` und in die Liste in `sw.js` eintragen.
- `manifest.webmanifest`, `icons/` – App-Name und -Symbole
- `sw.js` – Service Worker für den Offline-Betrieb.
  **Wichtig:** Bei jeder Änderung an den Dateien `VERSION` in `sw.js` hochzählen,
  sonst bekommen installierte Apps das Update nicht.

Kein Build-Schritt nötig.
