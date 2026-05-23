import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { I18nProvider } from "./i18n";
import { ThemeProvider, applyTheme, getInitialTheme } from "./lib/theme";

// Apply the saved theme synchronously, before React mounts, so the first
// paint already has the right palette (no flash of light theme). The same
// logic also lives inline in index.html as the very first thing executed.
applyTheme(getInitialTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </I18nProvider>
  </StrictMode>,
);
