from pathlib import Path
from typing import Optional
import pandas as pd
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware


# DATEN LADEN & VORBEREITEN

BASE_DIR = Path(__file__).parent
DATA_PATH = BASE_DIR / "Gesamtdatensatz.csv"


# Daten einlesen
df = pd.read_csv(DATA_PATH)
df["location_id"] = df["location_id"].astype(int)


# Zeitstempel in Datetime umwandeln
ts = pd.to_datetime(df["timestamp"])
try:
    # Zeitzone entfernen
    ts = ts.dt.tz_convert(None)
except TypeError:
    pass

df["timestamp"] = ts

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
    """
    Hilfs-Endpunkt: Gibt alle verfügbaren Standorte zurück.
    Für Dropdown-Menü im Frontend
    """
    # Location-IDs und Namen hole
    locations = df[['location_id', 'location_name']].drop_duplicates()
    return locations.to_dict(orient="records")

@app.get("/data")
def get_filtered_data(
    location_id: int, 
    start_date: Optional[str] = Query(None, description="Startdatum (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Enddatum (YYYY-MM-DD)")
):
    """
    Filtert nach Ort und Zeit.
    Gibt Erwachsenen- und Kinderzahlen zurück.
    Beispiel: /data?location_id=329&start_date=2024-04-01&end_date=2024-04-07
    
    location_id's:
    
    "Bahnhofstrasse Mitte": 329,
    "Bahnhofstrasse Nord": 331,
    "Bahnhofstrasse Süd": 330,
    "Lintheschergasse": 670,

    """


    #Nach Standort filtern
    filtered_df = df[df["location_id"] == location_id]

    #Nach Zeit filtern (falls Datum angegeben)
    if start_date:
        filtered_df = filtered_df[filtered_df["timestamp"] >= pd.to_datetime(start_date)]
    if end_date:
        filtered_df = filtered_df[filtered_df["timestamp"] <= pd.to_datetime(end_date)]

    #Nur benötigte Spalten zurückgeben
    columns_needed = [
        "timestamp", 
        "adult_pedestrians_count", 
        "child_pedestrians_count",
        "pedestrians_count" # Total
    ]
    
   
    result = filtered_df[columns_needed].sort_values("timestamp") #nach Zeit sortieren für Übersicht

    return result.to_dict(orient="records")