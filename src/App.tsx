import { Box } from "@mui/material";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { themeSettings } from "./theme";
import Dashboard from "@/scenes/dashboard/dashboard";
import Predictions from "@/scenes/prediction";
import Home from "./components/Home";
import Landing from "./components/Landing";
import Insights from "@/scenes/insights";
import Treasures from "@/scenes/treasure";
import Savings from "@/scenes/saving";

const AppContent = () => {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/treasures" element={<Treasures />} />
        <Route path="/savings" element={<Savings />} />
      </Routes>
    </Box>
  );
};

function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
