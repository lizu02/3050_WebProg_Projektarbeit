import "./App.css";

// Importiere die Layout-Teile
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import MainArea from "./MainArea";

// Die Hauptkomponente mit dem Layout-Grid
export default function App() {
  return (
    // "App" ist der Haupt-Grid-Container für Header, Content und Footer
    <div className="App">
      <Header />

      {/* Wrapper für MainArea (links) und Sidebar (rechts) */}
      <div className="main-content-wrapper">
        <MainArea />
        <Sidebar />
      </div>

      <Footer />
    </div>
  );
}
