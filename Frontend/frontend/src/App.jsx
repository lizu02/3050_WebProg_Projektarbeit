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

  const [Weather, setWeather] = useState("Unbekannt");
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

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
            date: "2022-08-01",
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
      url.searchParams.append("all_day", activeParams.allDay);

      console.log("Fetching:", url.toString());

      try {
        const response = await fetch(url);
        const json = await response.json();
        setRawData(json.chart);

        setWeather(json.weather || "Unbekannt");
        setTotalCount(json.total || 0);
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
      allDay: isAllDay,
    });
  };

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
          Weather={Weather}
          isLoading={loading}
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
