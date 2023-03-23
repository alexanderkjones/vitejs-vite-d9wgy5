import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { IProject } from "../../types/Project";
import { getProjectByUID } from "../../services/ProjectService";
import NavBar from "../../components/NavBar";

// MUI
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";

export default function Project() {
  const { currentUser } = useAuth();
  const { projectID } = useParams();
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);

  useEffect(() => {
    const getProject = async (projectID: string | undefined) => {
      if (!projectID) return;
      const project = await getProjectByUID(projectID);
      setCurrentProject(project);
    };

    getProject(projectID);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar>
        <Button variant="contained" size="small" startIcon={<SaveIcon />}>
          Save
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography align="center">{currentProject && currentProject.title + " : " + currentProject.uid}</Typography>
        </Box>
      </NavBar>
    </Box>
  );
}
