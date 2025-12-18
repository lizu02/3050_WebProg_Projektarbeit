import { Typography, Box } from "@mui/material";
import { Diagramm } from "./Diagramm";

export const MainArea = ({
  data,
  selectedLocation,
  selectedDate,
  selectedHour,
  Weather,
}) => (
  <main className="mainarea">
    <Box className="diagramm-box" sx={{ minHeight: "500px" }}>
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
        Datum: {selectedDate} | Stunde: {selectedHour}:00 <br />
        Wetter zum gewählten Zeitpunkt:<strong>{Weather}</strong>
        {}
      </Typography>

      <Diagramm
        data={data}
        location={selectedLocation}
        date={selectedDate}
        hour={selectedHour}
      />
    </Box>
  </main>
);
