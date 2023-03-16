import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import NavBar from './components/NavBar';
import Home from './pages/Home';

function App() {
  return (
    <Box className="App" sx={{ display: 'flex' }}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </AuthProvider>
      </Router>
    </Box>
  );
}

export default App;
