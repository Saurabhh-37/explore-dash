import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./components/Theme";
import Navbar from "./components/AppBar";
import Leaderboard from "./pages/Leaderboard";
import InfluencerDetail from "./pages/InfluencerDetail";
import ResearchConfig from "./pages/ResearchConfig";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Leaderboard />} />
          <Route path="/influencer" element={<InfluencerDetail />} />
          <Route path="/research" element={<ResearchConfig />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
