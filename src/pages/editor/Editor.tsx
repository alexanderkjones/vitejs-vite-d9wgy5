import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { FilesProvider } from "../../contexts/FilesContext";
import { IProject } from "../../types/Project";
import { getProjectByUID } from "../../services/ProjectService";

import EditorNavBar from "./EditorNavBar";
import FileBrowser from "./FileBrowser";

// MUI
import Box from "@mui/material/Box";

export default function Editor() {
  const { currentUser } = useAuth();
  const { projectID } = useParams();
  const [currentProject, setCurrentProject] = useState<IProject>({} as IProject);
  const [editableProject, setEditableProject] = useState<boolean>(false);
  const [openFileBrowser, setOpenFileBrowser] = useState<boolean>(true);

  useEffect(() => {
    if (currentProject && currentUser && currentProject.userUID == currentUser.uid) {
      setEditableProject(true);
    }
  }, [currentUser, currentProject]);

  useEffect(() => {
    const loadProjectAndFiles = async (projectID: string) => {
      const project = await getProjectByUID(projectID);
      if (!project) return;
      setCurrentProject(project);
    };

    projectID ? loadProjectAndFiles(projectID) : null;
  }, []);

  return (
    <FilesProvider>
      <Box sx={{ flexGrow: 1 }}>
        <EditorNavBar project={currentProject} />
        {editableProject && openFileBrowser && <FileBrowser project={currentProject} />}
      </Box>
    </FilesProvider>
  );
}
