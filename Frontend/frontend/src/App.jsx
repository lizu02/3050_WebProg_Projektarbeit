import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MainArea } from "./MainArea";
import { Footer } from "./Footer";
import "./App.css";

// ID's definieren fürs Backend
const LOCATION_IDS = {
  "Bahnhofstrasse (Mitte)": 329,
  "Bahnhofstrasse (Nord)": 331,
  "Bahnhofstrasse (Süd)": 330,
  Lintheschergasse: 670,
};

function App() {
  const [selectedLocation, setSelectedLocation] = useState(
    "Bahnhofstrasse (Mitte)"
  );
  const [selectedDate, setSelectedDate] = useState("2021-10-15");
  const [selectedHour, setSelectedHour] = useState(12);

  // Neu: Wetter ist kein Filter mehr, sondern eine Info aus den Daten
  const [Weather, setWeather] = useState("Unbekannt");

  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const locationId = LOCATION_IDS[selectedLocation];

      const url = new URL("http://127.0.0.1:8000/data");
      url.searchParams.append("location_id", locationId);
      url.searchParams.append("date", selectedDate);
      url.searchParams.append("hour", selectedHour);

      console.log("Fetching:", url.toString());

      try {
        const response = await fetch(url);
        const json = await response.json();
        setRawData(json);

        // Wetter aus dem ersten Datensatz extrahieren, falls vorhanden
        if (json && json.length > 0 && json[0].Wetter) {
          setWeather(json[0].Wetter);
        } else {
          setWeather("Keine Daten / Unbekannt");
        }
      } catch (err) {
        console.error(err);
        setRawData([]);
        setWeather("-");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedLocation, selectedDate, selectedHour]);

  return (
    <div className="App">
      <Header />

      <div className="main-content-wrapper">
        <MainArea
          data={rawData}
          selectedLocation={selectedLocation}
          selectedDate={selectedDate}
          selectedHour={selectedHour}
          Weather={Weather}
          isLoading={loading}
        />
        <Sidebar
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
