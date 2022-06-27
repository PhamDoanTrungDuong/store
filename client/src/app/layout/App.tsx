import React, { useState } from "react";
import Catalog from "../../features/catalog/Catalog";
import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Header from "./Header";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const paletteType = darkMode ? "dark" : "light";
  
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      }
    }
  })

  

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header darkMode={darkMode} setDarkMode={setDarkMode}/>
        <Container>
          <Catalog />
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default App;
