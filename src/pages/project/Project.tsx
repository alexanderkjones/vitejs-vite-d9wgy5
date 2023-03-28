import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { IProject } from "../../types/Project";
import { getProjectByUID } from "../../services/ProjectService";
import { getFilesFromProject } from "../../services/FileService";
import { IFolderNode, IFileNode } from "../../types/Files";
import NavBar from "../../components/NavBar";

// MUI
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import FileBrowser from "./FileBrowser";

export default function Project() {
  const { currentUser } = useAuth();
  const { projectID } = useParams();
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);
  const [editableProject, setEditableProject] = useState<boolean>(false);
  const [openFileBrowser, setOpenFileBrowser] = useState<boolean>(true);
  const [projectFiles, setProjectFiles] = useState<IFolderNode | IFolderNode | null>(null);

  useEffect(() => {
    if (currentProject && currentUser && currentProject.userUID == currentUser.uid) {
      setEditableProject(true);
    }
  }, [currentUser, currentProject]);

  useEffect(() => {
    const getProject = async (projectID: string | undefined) => {
      if (!projectID) return;
      const project = await getProjectByUID(projectID);
      setCurrentProject(project);
      if (!project) return;
      const projectFiles = await getFilesFromProject(project, "main");
      setProjectFiles(projectFiles);
    };

    getProject(projectID);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar>
        {editableProject && (
          <Button variant="contained" size="small" startIcon={<SaveIcon />}>
            Save
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Typography align="center">{currentProject && currentProject.title + " : " + currentProject.uid}</Typography>
        </Box>
      </NavBar>
      {editableProject && openFileBrowser &&  projectFiles && <FileBrowser data={projectFiles} />}
    </Box>
  );
}
