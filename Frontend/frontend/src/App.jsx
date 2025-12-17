import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MainArea } from "./MainArea";
import { Footer } from "./Footer";
import "./App.css";

function App() {
  const [selectedLocation, setSelectedLocation] = useState(
    "Bahnhofstrasse (Mitte)"
  );
  const [selectedDate, setSelectedDate] = useState("2024-06-12");
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedWeather, setSelectedWeather] = useState("clear");

  return (
    <div className="App">
      <Header />

      <div className="main-content-wrapper">
        <MainArea
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
