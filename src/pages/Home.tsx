import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NavBar from '../components/NavBar';

export default function Home() {
  console.log(import.meta.env);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar />
      <Typography>Home Page Here</Typography>
    </Box>
  );
}
