import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

/*Standard-Datei von React um überhaupt die Voraussetzungen zu schaffen*/

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
