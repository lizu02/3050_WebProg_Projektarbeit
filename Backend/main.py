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
df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True).dt.tz_convert(None)

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
def get_data(location_id: int, date: str, hour: int):
    """Liefert die Diagramm-Daten"""
    
    # Filtern nach ID, Datum und Stunde
    mask = (
        (df["location_id"] == location_id) & 
        (df["timestamp"].dt.date.astype(str) == date) & 
        (df["timestamp"].dt.hour == hour)
    )
    filtered = df[mask].copy()

    # HIER IST DEINE WUNSCH-ÄNDERUNG:
    # Wir benennen die Spalten direkt und hart um.
    rename_map = {
        "adult_pedestrians_count": "Erwachsene",
        "child_pedestrians_count": "Kinder",
        "weather_condition": "Wetter"  # Hier greifen wir deine Spalte ab
    }
    
    # Nur die benötigten Spalten auswählen und umbenennen
    # (Das verhindert auch, dass unnötiger Müll an das Frontend geschickt wird)
    result = filtered[list(rename_map.keys())].rename(columns=rename_map)

    return result.to_dict(orient="records")