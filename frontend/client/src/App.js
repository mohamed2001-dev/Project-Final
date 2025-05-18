import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Navbar from "scenes/navbar";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {isAuth ? (
            <>
              <Navbar />
              <Box p="1.5rem 2rem">
                <Routes>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/profile/:userId" element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
              </Box>
            </>
          ) : (
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;