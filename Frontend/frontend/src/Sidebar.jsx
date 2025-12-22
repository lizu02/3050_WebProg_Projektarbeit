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
  FormControlLabel,
  Checkbox,
} from "@mui/material";

/*Sidebar mit allen Filtern, Buttons und Einstellungen*/
export const Sidebar = ({
  locationList,
  selectedLocationID,
  setSelectedLocationID,
  selectedDate,
  setSelectedDate,
  selectedHour,
  setSelectedHour,
  isAllDay,
  setIsAllDay,
  onRefresh,
  onReset,
}) => {
  /*Uhrzeit wird automatisch via Slider aktualisiert*/
  const handleSliderChange = (event, newValue) => {
    setSelectedHour(newValue);
  };

  return (
    <aside className="sidebar">
      <Typography
        variant="h5"
        sx={{ mb: 5, fontSize: "1.1rem", fontWeight: "bold" }}
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
          value={selectedLocationID}
          label="Standort"
          onChange={(e) => setSelectedLocationID(e.target.value)}
          sx={{ backgroundColor: "white" }}
        >
          {locationList.map((loc) => (
            <MenuItem key={loc.location_id} value={loc.location_id}>
              {loc.location_name}
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
          InputLabelProps={{
            shrink: true,
          }} /*Durchgestrichen, weil befehl in künftigen MUI-Versionen nicht mehr verwendet wird*/
          sx={{
            backgroundColor: "white",
          }}
        />
      </FormControl>

      {/* Slider für die Uhrzeit*/}
      <Box sx={{ width: "100%", mb: 4 }}>
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

      {/*Checkbox ob ganzer Tag*/}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              sx={{ color: "#4285f4", "&.Mui-checked": { color: "#4285f4" } }}
            />
          }
          label={
            <Typography variant="body1" color="black">
              Ganzer Tag (alle Stunden)
            </Typography>
          }
        />
      </Box>

      {/*Button zum Visualisierung aktualisieren */}
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
        onClick={onRefresh}
      >
        Visualisierung aktualisieren
      </Button>

      {/*Button zum Visualisierung zurücksetzen auf Default */}
      <Button
        variant="contained"
        sx={{
          p: 1.5,
          mt: 2,
          backgroundColor: "#f44242ff",
          color: "white",
          "&:hover": {
            backgroundColor: "#ad2929ff",
          },
        }}
        fullWidth
        onClick={onReset}
      >
        Reset auf Default
      </Button>
    </aside>
  );
};
