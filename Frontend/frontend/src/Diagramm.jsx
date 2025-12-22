import React, { useEffect, useRef } from "react";
import embed from "vega-embed"; //vega-embed, weil vega-react probleme machte (siehe Readme)
import { Box, Typography } from "@mui/material";

/*speziell für vega-embed nötig: Merkt sich das richtige <div> im Browser
  wo dann das Vega-Digaramm hinkommt. Vega-embed braucht diese Angabe*/
export const Diagramm = ({ data, total }) => {
  const containerRef = useRef(null);

  /* Nur zeichnen, wenn neue Daten da sind und der Container bereit ist*/
  useEffect(() => {
    if (data && containerRef.current) {
      embed(containerRef.current, data, {
        actions: false,
        renderer: "svg",
      }).catch(console.error);
    }
  }, [data]);

  /*Formatierung Diagramm-Box*/
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
      {/*Hier wird das Vega-Digaramm gezeichnet*/}
      <div ref={containerRef} />

      {/*Gesamtanzahl Fussgänger anzeigen*/}
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="h8" fontWeight="bold" sx={{ color: "black" }}>
          Gesamte Anzahl Fussgänger: {total}
        </Typography>
      </Box>
    </Box>
  );
};
