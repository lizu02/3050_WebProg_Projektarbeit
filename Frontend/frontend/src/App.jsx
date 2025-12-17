import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MainArea } from "./MainArea";
import { Footer } from "./Footer";
import "./App.css";
import teildaten from "./Teildatensatz.json";

function App() {
  const [selectedLocation, setSelectedLocation] = useState(
    "Bahnhofstrasse (Mitte)"
  );
  // KORREKTUR 1: Startdatum auf einen Wert gesetzt, der im Datensatz existiert
  const [selectedDate, setSelectedDate] = useState("2021-10-15");
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedWeather, setSelectedWeather] = useState("clear");

  const filteredData = teildaten.filter((item) => {
    // 1. Ort filtern
    const isLocationMatch = item.location_name === selectedLocation;

    // 2. Datum filtern
    // Wir prüfen, ob der Zeitstempel mit dem gewählten Datum (YYYY-MM-DD) beginnt
    const isDateMatch = item.timestamp.startsWith(selectedDate);

    // 3. Stunde filtern (NEU)
    // Der Timestamp im JSON hat das Format "YYYY-MM-DD HH:mm:ss+00:00"
    // Wir extrahieren die Stunde (Zeichen an Index 11 und 12) und wandeln sie in eine Zahl um.
    const itemHour = parseInt(item.timestamp.substring(11, 13), 10);
    const isHourMatch = itemHour === selectedHour;

    // Hinweis: Wetter-Filterung ist hier optional. Da die Wetter-Bezeichnungen im JSON
    // (z.B. "partly-cloudy-night") oft nicht exakt mit den einfachen Sidebar-Werten
    // (z.B. "partly-cloudy") übereinstimmen, lassen wir sie für die Stabilität erst mal weg.
    // Wenn du sie brauchst, müsstest du eine "includes"-Logik einbauen.

    return isLocationMatch && isDateMatch && isHourMatch;
  });

  return (
    <div className="App">
      <Header />

      <div className="main-content-wrapper">
        <MainArea
          data={filteredData}
          selectedLocation={selectedLocation}
          selectedDate={selectedDate}
          selectedHour={selectedHour}
          selectedWeather={selectedWeather}
        />
        <Sidebar
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
          selectedWeather={selectedWeather}
          setSelectedWeather={setSelectedWeather}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
