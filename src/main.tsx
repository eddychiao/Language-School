import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.tsx";
import "./styles/global.css";

// GitHub Pages has no server-side rewrites, so a deep link or refresh on a
// route like /words/3 would 404 with browser-history routing. Hash routing
// (/#/words/3) keeps everything client-side and always resolves.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
