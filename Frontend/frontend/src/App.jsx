import { useState } from "react";
import { VegaLite } from "react-vega";
import "./App.css";

function App() {
  const [location, setLocation] = useState("Bahnhofstrasse (Mitte)");
  const [date, setDate] = useState("2021-10-15");
  const [hour, setHour] = useState(10);

  // Dummy-Daten für Vega später mit backend ersetzen
  const data = {
    values: [
      { category: "Kinder", count: 25 },
      { category: "Erwachsene", count: 75 },
    ],
  };

  // Vega-Lite Spec für Donut
  const spec = {
    mark: { type: "arc", innerRadius: 50 },
    encoding: {
      theta: { field: "count", type: "quantitative" },
      color: {
        field: "category",
        type: "nominal",
        scale: { range: ["#ffa64d", "#ff6fb3"] },
      },
    },
    view: { stroke: null },
    data: data,
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <strong>Bahnhofstrasse – Kinderanteil</strong>
      </header>

      {/* CONTENT */}
      <div className="content">
        {/* MAIN */}
        <section className="main">
          {/* Diagramm */}
          <div className="panel">
            <div className="panel-title">
              <span>DIAGRAMM</span>
              <span>
                {date} · {hour}:00
              </span>
            </div>
            <div className="chart-wrapper">
              <VegaLite spec={spec} />
            </div>
          </div>

          {/* Karte */}
          <div className="panel">
            <div className="panel-title">KARTE</div>
            <div className="map-placeholder">Hier kommt später die Karte</div>
          </div>
        </section>

        {/* SIDEBAR */}
        <aside className="panel sidebar">
          <div className="form">
            <div className="field">
              <label>Standort</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option>Bahnhofstrasse (Nord)</option>
                <option>Bahnhofstrasse (Mitte)</option>
                <option>Bahnhofstrasse (Süd)</option>
                <option>Lintheschergasse</option>
              </select>
            </div>

            <div className="field">
              <label>Datum</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min="2021-09-01"
                max="2025-07-31"
              />
            </div>

            <div className="field">
              <label>Stunde</label>
              <input
                type="range"
                min="0"
                max="23"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
              />
              <div className="hour-display">
                <span>00:00</span>
                <span>{hour}:00</span>
                <span>23:00</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="footer">GIS-Projekt · Jan & Livio · 21.12.2025</footer>
    </div>
  );
}

export default App;
