import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NavBar from "../components/NavBar";
import { getCurrentUserGithubProfile } from "../services/GithubService";

export default function Home() {
  console.log("profile", getCurrentUserGithubProfile());
  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar />
      <Typography>Home Page Here</Typography>
    </Box>
  );
}
