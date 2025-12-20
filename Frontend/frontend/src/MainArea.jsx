import { Typography, Box } from "@mui/material";
import { Diagramm } from "./Diagramm";

export const MainArea = ({
  data,
  selectedLocation,
  selectedDate,
  selectedHour,
  isAllDay,
  Weather,
  totalCount,
}) => (
  <main className="mainarea">
    <Typography variant="h6" sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
      Fokusfrage (Default-Einstellung):
    </Typography>
    <Typography variant="h6" sx={{ mb: 3, fontSize: "1.1rem" }}>
      Wie war der Anteil Kinder vs. Erwachsene am schweizer Nationalfeiertag um
      12:00 im Jahr 2022 an der Bahnhofstrasse (Mitte) in Zürich?
    </Typography>
    <Box className="diagramm-box" sx={{ p: 2, pl: 5 }}>
      <Typography
        variant="h6"
        sx={{ mb: 1, fontSize: "1.1rem", fontWeight: "bold" }}
      >
        Visualisierung Kinder- vs. Erwachsenenanteil
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1, fontSize: "0.85rem" }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 1, fontSize: "0.85rem", fontWeight: "bold" }}
        >
          Aktuelle Filter:
        </Typography>
        <Box component="span">Ort: {selectedLocation}</Box>
        <br />
        Datum: {selectedDate}
        <br />
        {isAllDay ? (
          <strong>Ganzer Tag</strong>
        ) : (
          <span>Zeit: {selectedHour}:00 Uhr</span>
        )}
        <br />
        <br />
        Wetter: <strong>{Weather}</strong>
      </Typography>

      <Diagramm data={data} total={totalCount} />
    </Box>
  </main>
);
