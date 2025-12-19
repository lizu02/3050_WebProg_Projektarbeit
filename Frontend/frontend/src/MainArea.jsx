import { Typography, Box } from "@mui/material";
import { Diagramm } from "./Diagramm";

export const MainArea = ({
  data,
  selectedLocation,
  selectedDate,
  selectedHour,
  Weather,
  totalCount,
}) => (
  <main className="mainarea">
    <Box className="diagramm-box" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1, fontSize: "1.1rem" }}>
        Visualisierung Kinder- vs. Erwachsenenanteil
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1, fontSize: "0.85rem" }}
      >
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

      <Diagramm data={data} total={totalCount} />
    </Box>
  </main>
);
