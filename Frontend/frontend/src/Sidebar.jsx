import {
  Typography,
  Box,
  Select,
  MenuItem,
  Slider,
  FormControl,
  InputLabel,
  TextField,
  Button,
} from "@mui/material";

const LOCATIONS = [
  "Bahnhofstrasse (Nord)",
  "Bahnhofstrasse (Mitte)",
  "Bahnhofstrasse (Süd)",
  "Lintheschergasse",
];
const WEATHER_CONDITIONS = [
  { value: "clear", label: "Klar" },
  { value: "partly-cloudy", label: "Teilweise bewölkt" },
  { value: "rain", label: "Regen" },
  { value: "snow", label: "Schnee" },
  { value: "fog", label: "Nebel" },
];

export const Sidebar = ({
  selectedLocation,
  setSelectedLocation,
  selectedDate,
  setSelectedDate,
  selectedHour,
  setSelectedHour,
  selectedWeather,
  setSelectedWeather,
}) => {
  const handleSliderChange = (event, newValue) => {
    setSelectedHour(newValue);
  };

  return (
    <aside className="sidebar">
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "bold", color: "black" }}
      >
        Filter & Einstellungen
      </Typography>

      {/*Dropdown für Filter nach Ort*/}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="location-label" sx={{ color: "black" }}>
          Standort
        </InputLabel>
        <Select
          labelId="location-label"
          id="location-select"
          value={selectedLocation}
          label="Standort"
          onChange={(e) => setSelectedLocation(e.target.value)}
          sx={{ backgroundColor: "white" }}
        >
          {LOCATIONS.map((loc) => (
            <MenuItem key={loc} value={loc}>
              {loc}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/*Eingabe des Datums*/}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <TextField
          id="date-input"
          label="Datum auswählen"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            backgroundColor: "white",
          }}
        />
      </FormControl>

      {/* Slider für die Uhrzeit*/}
      <Box sx={{ width: "100%", mb: 4, px: 1 }}>
        <Typography id="hour-slider-label" gutterBottom sx={{ color: "black" }}>
          Uhrzeit (Stunde): <strong>{selectedHour}:00 Uhr</strong>
        </Typography>
        <Slider
          aria-labelledby="hour-slider-label"
          value={selectedHour}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={23}
          sx={{ color: "#4285f4" }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="caption" sx={{ color: "black" }}>
            00:00
          </Typography>
          <Typography variant="caption" sx={{ color: "black" }}>
            23:00
          </Typography>
        </Box>
      </Box>

      {/* Dropdown für Wetterbedingungen */}
      <FormControl fullWidth sx={{ mb: 5 }}>
        <InputLabel id="weather-label" sx={{ color: "black" }}>
          Wetterzustand
        </InputLabel>
        <Select
          labelId="weather-label"
          id="weather-select"
          value={selectedWeather}
          label="Wetterzustand"
          onChange={(e) => setSelectedWeather(e.target.value)}
          sx={{ backgroundColor: "white" }}
        >
          {WEATHER_CONDITIONS.map((weather) => (
            <MenuItem key={weather.value} value={weather.value}>
              {weather.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/*Datenabfrage-Knopf Kalendersymbol */}
      <Button
        variant="contained"
        sx={{
          p: 1.5,
          mt: 2,
          backgroundColor: "#4285f4",
          color: "white",
          "&:hover": {
            backgroundColor: "#3366cc",
          },
        }}
        fullWidth
        onClick={() =>
          console.log("Starte Datenabfrage mit den Filtern:", {
            selectedLocation,
            selectedDate,
            selectedHour,
            selectedWeather,
          })
        }
      >
        Visualisierung aktualisieren
      </Button>
    </aside>
  );
};
