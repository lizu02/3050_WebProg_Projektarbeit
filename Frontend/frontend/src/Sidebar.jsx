// Sidebar Komponente für alle Filter und Eingaben
export default function Sidebar() {
  return (
    // Der rechte Bereich für die Filter
    <aside className="sidebar-container">
      <h2>Filter & Einstellungen</h2>

      {/* 1. Standortauswahl */}
      <div className="sidebar-section">
        <h3>Wähle Standort (Dropdown)</h3>
        {/* Hier kommt später die Dropdown-Logik rein */}
        {/* Rahmen entfernt */}
        <div style={{ padding: "10px" }}>Standortauswahl</div>
      </div>

      {/* 2. Datum/Zeitpunkt */}
      <div className="sidebar-section">
        <h3>Datum & Zeitpunkt</h3>
        {/* Hier kommen später die Input-Felder rein */}
        <div>Datum: [TT | MM | JJJJ]</div>
        {/* Rahmen entfernt */}
        <div style={{ padding: "10px", marginTop: "10px" }}>
          Zeitpunkt (Slider)
        </div>
      </div>

      {/* 3. Wetterbedingungen */}
      <div className="sidebar-section">
        <h3>Wetterbedingung (Dropdown)</h3>
        {/* Hier kommt später die Dropdown-Logik rein */}
        {/* Rahmen entfernt */}
        <div style={{ padding: "10px" }}>Wetterauswahl</div>
      </div>
    </aside>
  );
}
