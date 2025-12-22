import { Typography, Box, Paper } from "@mui/material";
import { Diagramm } from "./Diagramm";

export const MainArea = ({
  data,
  selectedLocation,
  selectedDate,
  selectedHour,
  isAllDay,
  weather,
  totalCount,
}) => (
  <main className="mainarea">
    <Typography variant="h6" sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
      Fokusfrage (Default-Einstellung):
    </Typography>
    <Typography variant="h6" sx={{ mb: 3, fontSize: "1.1rem" }}>
      Wie war der Anteil Kinder vs. Erwachsene am Schweizer Nationalfeiertag um
      12:00 im Jahr 2022 an der Bahnhofstrasse (Mitte) in Zürich?
    </Typography>

    {/*Container für das Diagramm*/}
    <Box className="diagramm-box" sx={{ p: 2, pl: 5 }}>
      <Typography
        variant="h6"
        sx={{ mb: 1, fontSize: "1.1rem", fontWeight: "bold" }}
      >
        Visualisierung Kinder- vs. Erwachsenenanteil
      </Typography>
      {/*Aktuelle Filter anzeigen*/}
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
        Wetter: <strong>{weather}</strong>
      </Typography>

      {/*Diagramm-Komponente*/}
      {totalCount === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center", backgroundColor: "#f5f5f5" }}>
          <Typography color="text.secondary">
            Keine Daten für die aktuelle Filterauswahl vorhanden.
          </Typography>
        </Paper>
      ) : (
        <Diagramm data={data} total={totalCount} />
      )}
    </Box>
  </main>
);
