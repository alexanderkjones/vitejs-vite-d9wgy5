import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";

// MUI
import Box from "@mui/material/Box";
import NavBar from "../components/NavBar";
import Typography from "@mui/material/Typography";

export default function Project() {
  const { currentUser } = useAuth();
  const { projectID } = useParams();

  useEffect(() => {}, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar />
      <Box sx={{ display: "flex", mt: 4, p: 5 }}>
        <Box>
          <Typography>Project:{projectID}</Typography>
        </Box>
        <Box sx={{ display: "flex", flexGrow: 1 }}></Box>
      </Box>
    </Box>
  );
}
