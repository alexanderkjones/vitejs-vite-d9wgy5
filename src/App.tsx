import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import Home from "./pages/home/Home";
import Project from "./pages/Project";

function App() {
  return (
    <Box className="App" sx={{ display: "flex" }}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:projectID" element={<Project />} />
          </Routes>
        </AuthProvider>
      </Router>
    </Box>
  );
}

export default App;
