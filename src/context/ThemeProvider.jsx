import { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
      background: {
        default: darkMode ? "#303030" : "#fafafa",
        paper: darkMode ? "#424242" : "#fff",
      },
    },
  });

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const value = {
    darkMode,
    toggleTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
