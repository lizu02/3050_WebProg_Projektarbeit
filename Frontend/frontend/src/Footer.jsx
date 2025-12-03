// Footer-Komponente
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Stellt die Metadaten unten dar
    <footer className="footer-container">
      <div>GIS-Projekt | Webprogrammierung</div>
      <div>Autoren: Jan & Livio</div>
      <div>Datum: 24.12.{currentYear}</div>
    </footer>
  );
}
