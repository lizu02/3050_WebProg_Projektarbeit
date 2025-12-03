from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from contextlib import asynccontextmanager
import pandas as pd
import os

# --- KONFIGURATION ---
CSV_DATEI = "Gesamtdatensatz.csv"
df: pd.DataFrame = None # Typ-Hinweis hinzufügen

# --- 1. PYDANTIC MODELLE (L11 - Data Validation) ---
# Anstatt rohe Dicts zu senden, definieren wir ein sauberes Schema.
# Das ist "Best Practice", damit das Frontend genau weiss, was ankommt.

class Messung(BaseModel):
    # Wir wählen nur die Felder aus, die das Frontend wirklich braucht
    # (Data Hiding / DTO Pattern)
    timestamp: str
    location_id: int
    location_name: Optional[str] = None
    pedestrians_count: int
    adult_pedestrians_count: Optional[int] = None
    child_pedestrians_count: Optional[int] = None
    weather_condition: Optional[str] = None
    temperature: Optional[float] = None

    # Config für Pandas-Kompatibilität (wichtig!)
    class Config:
        from_attributes = True

# --- LIFECYCLE (L10 - Events) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    global df
    print("🔄 [Startup] Lade Datensatz...")
    if os.path.exists(CSV_DATEI):
        try:
            # Optimierung: Wir parsen das Datum direkt beim Laden
            df = pd.read_csv(CSV_DATEI, parse_dates=['timestamp'])
            # WICHTIG: NaN Werte (leere Zellen) machen JSON kaputt. 
            # Wir füllen sie hier einmalig, statt bei jedem Request.
            df = df.where(pd.notnull(df), None)
            print(f"✅ [Success] {len(df)} Zeilen geladen.")
        except Exception as e:
            print(f"❌ [Error] Fehler: {e}")
    else:
        print(f"⚠️ [Warning] Datei '{CSV_DATEI}' fehlt!")
    
    yield
    print("🛑 [Shutdown] Server beendet.")

app = FastAPI(
    title="Fussgängerfrequenzen API",
    description="Backend für Projektarbeit HS25",
    version="1.0.0",
    lifespan=lifespan
)

# CORS (Damit React zugreifen darf)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ENDPUNKTE (L10/L12 - Path & Query Params) ---

@app.get("/", tags=["Status"])
def read_root():
    """Prüft, ob die API läuft und Daten vorhanden sind."""
    if df is None:
        return {"status": "error", "message": "Keine Daten geladen"}
    return {
        "status": "online", 
        "rows_loaded": len(df),
        "columns": list(df.columns)
    }

# Hier nutzen wir das Pydantic Model 'Messung' als response_model.
# Das garantiert, dass die API immer eine Liste von Messungen zurückgibt.
@app.get("/data", response_model=List[Messung], tags=["Daten"])
def get_filtered_data(
    location_id: Optional[int] = Query(None, description="Filter nach Standort ID"),
    limit: int = Query(100, ge=1, le=1000, description="Max. Anzahl Datensätze (Default: 100)")
):
    """
    Holt gefilterte Daten.
    Dies verhindert, dass wir aus Versehen 26MB an das Frontend schicken.
    """
    if df is None:
        raise HTTPException(status_code=503, detail="Daten noch nicht geladen")

    # Wir arbeiten auf einer Kopie, um das Original nicht zu ändern
    result = df

    # 1. Filtern nach Standort (falls angegeben)
    if location_id is not None:
        result = result[result['location_id'] == location_id]

    # 2. Limitieren (Performance!)
    # Wir nehmen die neuesten Daten (tail) oder die ersten (head), je nach Wunsch.
    # Hier nehmen wir z.B. die ersten 'limit' Zeilen des gefilterten Ergebnisses.
    result = result.head(limit)

    # Umwandlung in Liste von Dicts, Pydantic validiert den Rest automatisch
    return result.to_dict(orient="records")

@app.get("/locations", tags=["Metadaten"])
def get_locations():
    """Gibt eine Liste aller verfügbaren Standorte zurück."""
    if df is None:
         raise HTTPException(status_code=503, detail="Daten noch nicht geladen")
    
    # Pandas Magie: Eindeutige Standorte extrahieren
    locations = df[['location_id', 'location_name']].drop_duplicates().to_dict(orient="records")
    return locations