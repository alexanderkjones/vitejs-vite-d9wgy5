import { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function NavBar({ children }: { children: ReactNode }) {
  const { currentUser, signInWithGithub, signOut } = useAuth();
  const { projectID } = useParams();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" component="div" sx={{ mr: 5 }}>
            XR Makers
          </Typography>
          {children}
          {!currentUser && (
            <Button onClick={() => signInWithGithub()} color="inherit">
              Sign In
            </Button>
          )}
          {currentUser && (
            <Button onClick={() => signOut()} color="inherit">
              Sign Out
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
