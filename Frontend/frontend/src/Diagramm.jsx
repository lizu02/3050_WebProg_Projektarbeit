import React, { useEffect, useRef, useState } from "react";
import vegaEmbed from "vega-embed";
import { Box, Paper, Typography } from "@mui/material";

export const Diagramm = ({ data }) => {
  const containerRef = useRef(null);
  const [chartError, setChartError] = useState(null);

  // 1. Daten aggregieren
  const totalAdults = data
    ? data.reduce((sum, item) => sum + (item.Erwachsene || 0), 0)
    : 0;
  const totalChildren = data
    ? data.reduce((sum, item) => sum + (item.Kinder || 0), 0)
    : 0;

  const totalSum = totalAdults + totalChildren;

  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    const spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "Verhältnis Kinder zu Erwachsenen",
      width: 350,
      height: 350,
      padding: 10,
      data: {
        values: [
          { category: "Erwachsene", value: totalAdults },
          { category: "Kinder", value: totalChildren },
        ],
      },
      mark: { type: "arc", innerRadius: 70, tooltip: true, cursor: "pointer" },
      encoding: {
        theta: { field: "value", type: "quantitative", stack: true },
        color: {
          field: "category",
          type: "nominal",
          scale: { range: ["#1976d2", "#ed6c02"] },

          legend: {
            title: "Kategorie",
            orient: "bottom",
            titleFontSize: 14,
            labelFontSize: 12,
            symbolSize: 150,
            padding: 20,
          },
        },

        tooltip: [
          { field: "category", type: "nominal", title: "Kategorie" },
          { field: "value", type: "quantitative", title: "Anzahl" },
        ],
      },
      view: { stroke: null },
      config: {
        background: "transparent",
      },
    };

    vegaEmbed(containerRef.current, spec, { actions: false })
      .then(() => setChartError(null))
      .catch((error) => {
        console.error("Vega Embed Error:", error);
        setChartError(error.message);
      });

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [data, totalAdults, totalChildren]);

  if (!data || data.length === 0) {
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
        gap: 2,
      }}
    >
      <div
        ref={containerRef}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      />

      {chartError && (
        <Typography color="error" variant="caption">
          Fehler beim Laden des Diagramms.
        </Typography>
      )}

      <Box sx={{ textAlign: "center", mt: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          Gesamte Anzahl Menschen: {totalSum}
        </Typography>
      </Box>
    </Box>
  );
};
