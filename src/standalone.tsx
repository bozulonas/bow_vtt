import React from "react";
import ReactDOM from "react-dom/client";
import { StandaloneDiceRoller } from "./standalone/StandaloneDiceRoller";
import { PluginThemeProvider } from "./plugin/PluginThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { GlobalStyles } from "./GlobalStyles";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PluginThemeProvider>
      <CssBaseline />
      <GlobalStyles />
      <StandaloneDiceRoller />
    </PluginThemeProvider>
  </React.StrictMode>
); 