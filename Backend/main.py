from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
from contextlib import asynccontextmanager

# --- KONFIGURATION ---
# Pfad zur CSV-Datei (muss im gleichen Ordner liegen)
CSV_DATEI = "Gesamtdatensatz.csv"

# Globale Variable für den DataFrame
df = None

# --- LIFECYCLE (STARTUP LOGIK) ---
# Diese Funktion wird automatisch ausgeführt, wenn du 'fastapi dev main.py' eingibst.
@asynccontextmanager
async def lifespan(app: FastAPI):
    global df
    print("🔄 [Startup] Fahre Backend hoch...")
    
    # Prüfen, ob die Datei existiert
    if os.path.exists(CSV_DATEI):
        print(f"📂 [Loading] Lese '{CSV_DATEI}' ein... (Das kann kurz dauern)")
        try:
            # [cite_start]Daten in den Arbeitsspeicher laden [cite: 43]
            # parse_dates sorgt dafür, dass 'timestamp' sofort als echtes Datum verstanden wird
            df = pd.read_csv(CSV_DATEI, parse_dates=['timestamp'])
            
            print("✅ [Success] Daten erfolgreich geladen!")
            print(f"📊 Einträge: {len(df)}")
            if not df.empty:
                print(f"📅 Zeitraum: {df['timestamp'].min()} bis {df['timestamp'].max()}")
        except Exception as e:
            print(f"❌ [Error] Fehler beim Lesen der CSV: {e}")
    else:
        print(f"⚠️ [Warning] Datei '{CSV_DATEI}' nicht gefunden!")
        print("   Bitte lege die CSV-Datei in denselben Ordner wie diese main.py.")
    
    yield  # Hier läuft die App und wartet auf Anfragen...
    
    print("🛑 [Shutdown] Backend wird beendet.")
    # Hier könnten wir Speicher bereinigen, falls nötig.

# --- APP DEFINITION ---
# Das 'lifespan'-Argument verbindet unsere Lade-Logik mit der App
app = FastAPI(lifespan=lifespan)

# --- CORS (WICHTIG FÜR FRONTEND) ---
# Erlaubt deinem React-Frontend (meist Port 3000) den Zugriff
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Erlaubt alle Quellen (für Entwicklung ok)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ENDPUNKTE ---

@app.get("/")
def read_root():
    """Startseite: Zeigt Status und Info zum Datensatz."""
    if df is not None:
        return {
            "status": "online",
            "message": "Backend läuft mit fastapi dev!",
            "total_records": len(df),
            # Zeigt die Spaltennamen, damit ihr wisst, wie ihr filtern könnt
            "columns": list(df.columns) 
        }
    return {"status": "error", "message": "Keine Daten geladen."}

@app.get("/preview")
def get_preview():
    """Gibt die ersten 5 Zeilen zurück (zum Testen der Datenstruktur)."""
    if df is not None:
        # [cite_start]Wir geben nur wenig Daten zurück, wie gefordert [cite: 44]
        return df.head(5).to_dict(orient="records")
    return {"error": "Daten nicht verfügbar"}