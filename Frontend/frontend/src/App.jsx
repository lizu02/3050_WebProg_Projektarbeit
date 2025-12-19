import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MainArea } from "./MainArea";
import { Footer } from "./Footer";
import "./App.css";

function App() {
  const [locationList, setLocationList] = useState([]);
  const [selectedLocationID, setSelectedLocationID] = useState("");
  const [selectedDate, setSelectedDate] = useState("2021-10-15");
  const [selectedHour, setSelectedHour] = useState(12);
  const [activeParams, setActiveParams] = useState({
    id: "",
    date: "2021-10-15",
    hour: 12,
  });

  // Neu: Wetter ist kein Filter mehr, sondern eine Info aus den Daten
  const [Weather, setWeather] = useState("Unbekannt");

  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/locations")
      .then((res) => res.json())
      .then((data) => {
        console.log("Orte geladen:", data);
        setLocationList(data);
        if (data.length > 0) {
          const firstID = data[0].location_id;
          setSelectedLocationID(firstID);
          setActiveParams({
            id: firstID,
            date: "2021-10-15",
            hour: 12,
          });
        }
      })
      .catch((err) => console.error("Fehler beim Laden der Orte:", err));
  }, []);

  useEffect(() => {
    if (!activeParams.id) return;

    const fetchData = async () => {
      setLoading(true);

      const url = new URL("http://127.0.0.1:8000/data");
      url.searchParams.append("location_id", activeParams.id);
      url.searchParams.append("date", activeParams.date);
      url.searchParams.append("hour", activeParams.hour);

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
  }, [activeParams]);

  const handleRefresh = () => {
    console.log("Button gedrückt! Übernehme Werte...");
    setActiveParams({
      id: selectedLocationID,
      date: selectedDate,
      hour: selectedHour,
    });
  };

  const currentLocationName =
    locationList.find((l) => l.location_id === activeParams.id)
      ?.location_name || "Lade...";

  return (
    <div className="App">
      <Header />

      <div className="main-content-wrapper">
        <MainArea
          data={rawData}
          selectedLocation={currentLocationName}
          selectedDate={activeParams.date}
          selectedHour={activeParams.hour}
          Weather={Weather}
          isLoading={loading}
        />
        <Sidebar
          locationList={locationList}
          selectedLocationID={selectedLocationID}
          setSelectedLocationID={setSelectedLocationID}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
          onRefresh={handleRefresh}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
