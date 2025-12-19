import React, { useEffect, useRef } from "react";
import embed from "vega-embed";
import { Box, Paper, Typography } from "@mui/material";

export const Diagramm = ({ data, total }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Nur zeichnen, wenn Daten da sind und der Container bereit ist
    if (data && containerRef.current) {
      embed(containerRef.current, data, {
        actions: false,
        renderer: "svg",
      }).catch(console.error);
    }
  }, [data]);

  // Fall: Keine Daten vorhanden
  if (!data) {
    return (
      <Paper sx={{ p: 3, textAlign: "center", backgroundColor: "#f5f5f5" }}>
        <Typography color="textSecondary">
          Keine Daten für die aktuelle Auswahl verfügbar.
          <br />
          <small>(Versuche, den Slider oder das Wetter zu ändern)</small>
        </Typography>
      </Paper>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 0,
      }}
    >
      <div ref={containerRef} />

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "black" }}>
          Gesamte Anzahl Fussgänger: {total}
        </Typography>
      </Box>
    </Box>
  );
};
