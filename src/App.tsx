import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import Home from "./pages/home/Home";
import Editor from "./pages/editor/Editor";

function App() {
  return (
    <Box className="App" sx={{ display: "flex" }}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:projectID/edit" element={<Editor />} />
          </Routes>
        </AuthProvider>
      </Router>
    </Box>
  );
}

export default App;
