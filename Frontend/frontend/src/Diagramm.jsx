import React from "react";
import { VegaLite } from "react-vega";
import { Box, Paper, Typography } from "@mui/material";

export const Diagramm = ({ data }) => {
  // Falls keine Daten vorhanden sind (z.B. während des Ladens oder bei leerem Filter)
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center", backgroundColor: "#f5f5f5" }}>
        <Typography color="textSecondary">
          Keine Daten für die aktuelle Auswahl verfügbar.
        </Typography>
      </Paper>
    );
  }

  // Aggregation der Daten für das Kuchendiagramm [cite: 37]
  const totalAdults = data.reduce(
    (sum, item) => sum + (item.adult_pedestrians_count || 0),
    0
  );
  const totalChildren = data.reduce(
    (sum, item) => sum + (item.child_pedestrians_count || 0),
    0
  );

  // Datenformat für Vega-Lite
  const chartValues = [
    { category: "Erwachsene", value: totalAdults },
    { category: "Kinder", value: totalChildren },
  ];

  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Verhältnis Kinder zu Erwachsenen",
    width: 300,
    height: 300,
    data: { name: "table" },
    mark: { type: "arc", innerRadius: 60, tooltip: true }, // Donut-Style
    encoding: {
      theta: { field: "value", type: "quantitative" },
      color: {
        field: "category",
        type: "nominal",
        scale: { range: ["#1976d2", "#ed6c02"] }, // MUI Primary Blue & Warning Orange
        legend: { title: "Gruppe", orient: "bottom" },
      },
    },
    view: { stroke: null },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h6" component="h2">
        Anteil Kinder vs. Erwachsene
      </Typography>

      <VegaLite spec={spec} data={{ table: chartValues }} actions={false} />

      <Box sx={{ textAlign: "center", mt: 1 }}>
        <Typography variant="body2" fontWeight="bold">
          Gesamtanzahl: {(totalAdults + totalChildren).toLocaleString()}{" "}
          Passanten
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Kinderanteil:{" "}
          {totalAdults + totalChildren > 0
            ? ((totalChildren / (totalAdults + totalChildren)) * 100).toFixed(1)
            : 0}
          %
        </Typography>
      </Box>
    </Box>
  );
};
