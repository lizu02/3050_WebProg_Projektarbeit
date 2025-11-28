from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
from contextlib import asynccontextmanager

# --- KONFIGURATION ---
CSV_DATEI = "Gesamtdatensatz.csv"
df = None

# --- LIFECYCLE (STARTUP) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    global df
    print("🔄 [Startup] Fahre Backend hoch...")
    
    if os.path.exists(CSV_DATEI):
        print(f"📂 [Loading] Lese '{CSV_DATEI}' ein... (Das kann kurz dauern)")
        try:
            # Daten laden
            df = pd.read_csv(CSV_DATEI, parse_dates=['timestamp'])
            
            print("✅ [Success] Daten erfolgreich geladen!")
            print(f"📊 Einträge: {len(df)}")
            if not df.empty:
                print(f"📅 Zeitraum: {df['timestamp'].min()} bis {df['timestamp'].max()}")
        except Exception as e:
            print(f"❌ [Error] Fehler beim Lesen der CSV: {e}")
    else:
        print(f"⚠️ [Warning] Datei '{CSV_DATEI}' nicht gefunden!")
    
    yield
    print("🛑 [Shutdown] Backend wird beendet.")

app = FastAPI(lifespan=lifespan)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ENDPUNKTE ---

@app.get("/")
def read_root():
    if df is not None:
        return {
            "status": "online",
            "total_records": len(df),
            "columns": list(df.columns)
        }
    return {"status": "error", "message": "Keine Daten geladen."}

@app.get("/preview")
def get_preview():
    """Gibt die ersten 5 Zeilen zurück und behandelt NaN-Werte."""
    if df is not None:
        # 1. Wir nehmen eine Kopie der ersten 5 Zeilen
        preview_df = df.head(5).copy()
        
        # 2. DER FIX: Wir ersetzen NaN durch None (was zu JSON 'null' wird)
        # .astype(object) sorgt dafür, dass wir 'None' auch in Zahlen-Spalten schreiben dürfen
        # .where(pd.notnull(preview_df), None) behält Werte, ersetzt NaNs mit None
        preview_df = preview_df.astype(object).where(pd.notnull(preview_df), None)
        
        return preview_df.to_dict(orient="records")
        
    return {"error": "Daten nicht verfügbar"}