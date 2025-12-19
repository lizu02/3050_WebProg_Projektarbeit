from pathlib import Path
from typing import Optional
import pandas as pd
import altair as alt
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware




BASE_DIR = Path(__file__).parent
DATA_PATH = BASE_DIR / "Gesamtdatensatz.csv"


# Daten einlesen
df = pd.read_csv(DATA_PATH)
df["location_id"] = df["location_id"].astype(int)


# Zeitstempel in Datetime umwandeln
df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True).dt.tz_convert('Europe/Zurich').dt.tz_localize(None)

# leere Zellen ohne Werte im ganzen Datensatz in None umwandeln

df = df.where(pd.notnull(df), None)

print(f"Daten geladen: {len(df)} Zeilen.")

# FASTAPI App Konfig.

app = FastAPI(
    title="Projektarbeit API: Kinder vs. Erwachsene",
    description="API zur Analyse der Passantenfrequenzen an der bestimmten Standorten",
)

app.add_middleware(
    CORSMiddleware,
    # Zugriff von React regeln
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpunkte

@app.get("/")
def root():
    return {
        "message": "Das Backend läuft.",
        "Zeilen": len(df),
        "Spalten": list(df.columns)
    }

@app.get("/locations")
def get_locations():
    """Liefert die Liste aller Orte für das Dropdown-Menü"""
    # Wir nehmen nur ID und Name und entfernen Doppelte
    locations = df[['location_id', 'location_name']].drop_duplicates()
    locations = locations.sort_values('location_name')
    return locations.to_dict(orient="records")

@app.get("/data")
def get_data(location_id: int, date: str, hour: int, all_day: str = "false"):
    
    is_all_day = all_day.lower() == "true"
    
    """Liefert die Diagramm-Daten"""
    
    mask = (
        (df["location_id"] == location_id) & 
        (df["timestamp"].dt.date.astype(str) == date)
    )

    # Wenn NICHT ganzer Tag, dann auch nach Stunde filtern
    if not is_all_day:
        mask = mask & (df["timestamp"].dt.hour == hour)
    
    filtered = df[mask].copy()

    weather = "Unbekannt"
    if not filtered.empty:
        # Prüfen, ob die Spalte 'weather_condition' existiert
        if "weather_condition" in filtered.columns:
            weather = filtered.iloc[0]["weather_condition"]
        elif "Meteo" in filtered.columns: 
            weather = filtered.iloc[0]["Meteo"]
    
    
 # Daten aggregieren (Summe bilden)
    adults = filtered["adult_pedestrians_count"].sum()
    children = filtered["child_pedestrians_count"].sum()
    total_count = filtered["pedestrians_count"].sum()
    
# Kleinen DataFrame speziell für das Diagramm bauen
# Hier legen wir die Namen "Erwachsene" und "Kinder" fest (das ersetzt dein rename_map)
    chart_df = pd.DataFrame([
        {"Kategorie": "Erwachsene", "Anzahl": adults},
        {"Kategorie": "Kinder", "Anzahl": children}
    ])

# Das Diagramm definieren
    base = alt.Chart(chart_df).encode(
        theta=alt.Theta("Anzahl", stack=True)
    )

    chart = base.mark_arc(innerRadius=70).encode(
        color=alt.Color(
            "Kategorie", 
            scale=alt.Scale(range=["#1976d2", "#ed6c02"]), 
            # Hier stylen wir die Legende exakt wie früher (unten, groß)
            legend=alt.Legend(
                title="Kategorie",
                orient="bottom", 
                titleFontSize=14,
                labelFontSize=12,
                symbolSize=150,
                padding=20
            )
        ),
        tooltip=["Kategorie", "Anzahl"]
    ).properties(
        width=300,  
        height=300, 
        background="transparent" 
    ).configure_view(
        stroke=None 
    )

    # Rückgabe (Chart ohne Text innen, Total separat für Text drunter)
    return {
        "chart": chart.to_dict(),
        "weather": weather,
        "total": int(total_count)
    }