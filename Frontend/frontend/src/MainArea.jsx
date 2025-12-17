import { Typography, Box } from "@mui/material";

export const MainArea = ({
  selectedLocation,
  selectedDate,
  selectedHour,
  selectedWeather,
}) => (
  <main className="mainarea">
    <Box className="diagramm-box">
      <Typography variant="h6" sx={{ mb: 1 }}>
        Visualisierung Kinder- vs. Erwachsenenanteil
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        <Box component="span" sx={{ fontWeight: "bold" }}>
          Aktuelle Filter:
        </Box>
        <br />
        Standort: {selectedLocation}
        <br />
        Datum: {selectedDate} | Stunde: {selectedHour}:00 | Wetter:{" "}
        {selectedWeather}
      </Typography>
    </Box>
  </main>
);
