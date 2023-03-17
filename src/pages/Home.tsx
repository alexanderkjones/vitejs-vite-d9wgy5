import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NavBar from "../components/NavBar";
import { getCurrentUserGithubProfileData } from "../services/GithubService";

export default function Home() {
  console.log("profile", getCurrentUserGithubProfileData());
  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar />
      <Typography>Home Page Here</Typography>
    </Box>
  );
}
