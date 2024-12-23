import React from "react";
import ReactDOM from "react-dom/client";
import { StandaloneDiceRoller } from "./standalone/StandaloneDiceRoller";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

ReactDOM.createRoot(document.getElementById("dice-root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <StandaloneDiceRoller />
    </ThemeProvider>
  </React.StrictMode>
); 