import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MainArea } from "./MainArea";
import { Footer } from "./Footer";
import "./App.css";

function App() {
  const [locationList, setLocationList] = useState([]);
  const [selectedLocationID, setSelectedLocationID] = useState("");
  const [selectedDate, setSelectedDate] = useState("2022-08-01");
  const [selectedHour, setSelectedHour] = useState(12);
  const [isAllDay, setIsAllDay] = useState(false);
  const [activeParams, setActiveParams] = useState({
    id: "",
    date: "2022-08-01",
    hour: 12,
    allDay: false,
  });

  const [weather, setWeather] = useState("Unbekannt"); //Wetterzustand aus Backend holen
  const [rawData, setRawData] = useState([]); //Rohdaten für das Diagramm
  const [totalCount, setTotalCount] = useState(0); //Gesamtzahl der Fussgänger

  /*Einmal alle Standorte laden beim Start*/
  useEffect(() => {
    fetch("http://127.0.0.1:8000/locations")
      .then((res) => res.json())
      .then((data) => {
        setLocationList(data);
        /*Auf Default-Standort und Werte setzten*/
        if (data.length > 0) {
          const firstID = data[0].location_id;
          setSelectedLocationID(firstID);
          setActiveParams({
            id: firstID,
            date: "2022-08-01",
            hour: 12,
          });
        }
      })
      .catch((err) => console.error("Fehler beim Laden der Orte:", err));
  }, []);

  /*Diagrammdaten werden geladen, wenn Änderung via Filter geschieht*/
  useEffect(() => {
    if (!activeParams.id) return; // Abbruch falls kein Standort gesetzt

    const fetchData = async () => {
      /*URL mit den richtigen Parameteren zusammenbauen*/
      const url = new URL("http://127.0.0.1:8000/data");
      url.searchParams.append("location_id", activeParams.id);
      url.searchParams.append("date", activeParams.date);
      url.searchParams.append("hour", activeParams.hour);
      url.searchParams.append("all_day", activeParams.allDay);

      try {
        const response = await fetch(url);
        const json = await response.json();

        setRawData(json.chart); //Diagrammdaten

        /*Zusatzinfos zu Daten*/
        setWeather(json.weather || "Unbekannt");
        setTotalCount(json.total || 0);
      } catch (err) {
        console.error(err);
        setRawData([]);
        setWeather("-");
      }
    };

    fetchData();
  }, [activeParams]);

  /*Werte der Filter in Sidebar werden übernommen durch Button-Klick*/
  const handleRefresh = () => {
    setActiveParams({
      id: selectedLocationID,
      date: selectedDate,
      hour: selectedHour,
      allDay: isAllDay,
    });
  };

  /*Werte der Filter in Sidebar werden wieder auf Standard-Frage Default zurückgesetzt*/
  const handleReset = () => {
    const mitte =
      locationList.find((l) => l.location_name.includes("(Mitte)")) ||
      locationList[0];
    const defaultID = mitte.location_id;
    setSelectedLocationID(defaultID);
    setSelectedDate("2022-08-01");
    setSelectedHour(12);
    setIsAllDay(false);

    setActiveParams({
      id: defaultID,
      date: "2022-08-01",
      hour: 12,
      allDay: false,
    });
  };

  /*Akuteller Standort-Name*/
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
          isAllDay={activeParams.allDay}
          weather={weather}
          totalCount={totalCount}
        />
        <Sidebar
          locationList={locationList}
          selectedLocationID={selectedLocationID}
          setSelectedLocationID={setSelectedLocationID}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
          isAllDay={isAllDay}
          setIsAllDay={setIsAllDay}
          onRefresh={handleRefresh}
          onReset={handleReset}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
