# 3050 Webprogrammierung: Analyse Kinder- vs. Erwachsenenanteil in Zürich zu bestimmtem Zeitpunkt

# Grundfragestellung:

Wie war der Kinder- und Erwachsenenanteil an der Bahnhofstrasse (Mitte) am 01. August 2022 um 12:00 Uhr?

# Erläuterung:

Die Applikation analysiert Passantenfrequenzen an der Bahnhofstrasse Zürich. Der Fokus liegt dabei auf dem Verhältnis zwischen Kindern und Erwachsenen zu verschiedenen Uhrzeiten an verschiedenen Tagen. Die Grundfragestellung wird als «Default-Visualisierung» beim Aufrufen der Applikation angezeigt bzw. beantwortet.

# Wie ist das Projekt aufgebaut?

Grundsätzlich ist der Aufbau der Applikation in 2 Hauptbereiche unterteilt: Frontend und Backend.
Das Frontend umfasst dabei hauptsächlich das Layout und die Interaktions-Optionen. Das Backend hält die notwendigen Daten in gefiltertem Zustand bereit für die Übergabe an das Frontend.

Das Frontend funktioniert mit folgenden Technologien:

- React (Vite)
- Material UI (MUI) für das Interface Design
- Vega / Vega-Embed für Datenvisualisierungen.
  HINWEIS: Mit der Vega-react Bibliothek konnte keine Grafik aufgesetzt werden, da wohl ein Versionen-Problem vorlag. Nach Konsultation von KI wurde empfohlen stattdessen die Vega-embed Bibliothek für die Diagrammerstellung zu verwenden, was nun auch umgesetzt wurde.
  Das Backend funkioniert mit folgenden Technologien:
- Python (FastAPI)
- Pandas (Datenverarbeitung im Arbeitsspeicher)
- Uvicorn (ASGI-Server)

# Systemvoraussetzungen

Folgende Programme sollten auf Ihrem Rechner installiert sein:

- Python (Version 3.8 oder höher): Wird für das Backend (FastAPI) benötigt.
- Node.js (Long-life-Version): Wird für das Frontend (Vite/React) benötigt.
- Visual Studio Code wird als Editor empfohlen

# Vorbereitungen, Installation & Startanleitung für das lokale Ausführen der Applikation:

1. Gesamtdatensatz.csv muss zwingend im Ordner «Backend» (selbe Stelle wie die Datei main.py) liegen
2. Hauptprojektordner in VS-Code öffnen
3. In das Backend verzeichnis navigieren (cd Backend)
4. Select Interpreter: Meine Umgebung wählen
5. Bibliotheken für Backend installieren: pip install fastapi uvicorn pandas
6. Backend-Uvicorn-Server starten: fastapi dev main.py

---

7. Zweites Terminal öffnen und in das Frontend-Verzeichnis wechseln (cd Frontend) und gleich nochmals (cd frontend)
8. Abhängigkeiten installieren: npm install
9. Im selben Frontend-Verzeichnis die Applikation starten: npm run dev
   Wichtig: Das Frontend muss auf dem Port «http://localhost:5173» laufen. Ansonsten werden Anfragen auf das Backend nicht akzeptiert.

# Hinweise zur Nutzung

1. Per Default beim Aufruf der Applikation wir die Grundfragestellung beantwortet (Einstellung auf 01.08.2022 um 12:00, Standort Bahnhofstrasse Mitte)
2. Für die weitere Exploration der Daten können die Filter in der Sidebar rechts verwendet werden.
3. Wähle in der Sidebar einen Standort (z.B. "Bahnhofstrasse Nord").
4. Wähle ein Datum (die Datenbasis umfasst den Zeitraum vom 29.09.2021 bis 30.07.2025).
5. Nutze den Slider, um die genaue Uhrzeit zu wählen (immer ganze Stunden). Alternativ kann die Checkbox "Ganzer Tag" aktiviert werden, um das Verhältnis über einen ganzen Tag zu betrachten.
6. Klicke auf den Button «Visualisierung aktualisieren», um die Daten abzurufen.
7. Mite dem Button "Zurücksetzten auf Default" wird wieder der Ausgangszustand und somit die Grundfragestellung angezeigt.

# Autoren: Jan Rüdisühli & Livio Zurflüh
