import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { IUser } from "../../types/User";
import { IProject } from "../../types/Project";
import { createProject, getProjectsByUserUID } from "../../services/ProjectService";
import ProjectList from "./ProjectList";
import NewProjectDialog from "./NewProjectDialog";

// MUI
import Box from "@mui/material/Box";
import NavBar from "../../components/NavBar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";

export default function Home() {
  const { currentUser } = useAuth();
  const [openNewProjectDialog, setOpenNewProjectDialog] = useState<boolean>(false);
  const [projectList, setProjectList] = useState<IProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const handleNewProject = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenNewProjectDialog(true);
  };

  const handleCreateNewProject = async (title: string, description: string) => {
    console.log(title, description);
    if (!currentUser) return;
    const project = await createProject(title, description, currentUser.uid, false);
    console.log(project);
    if (!project) {
      return;
    }
    setSelectedProject(project);
    setOpenNewProjectDialog(false);
  };

  useEffect(() => {
    const getProjectList = async (user: IUser) => {
      const projects: IProject[] = await getProjectsByUserUID(user.uid);
      setProjectList(projects);
    };

    if (currentUser) {
      getProjectList(currentUser);
    }
  }, [currentUser]);

  const content = (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar />
      <Box sx={{ display: "flex", mt: 4, p: 5 }}>
        <Box>
          <Typography>Projects</Typography>
        </Box>
        <Box sx={{ display: "flex", flexGrow: 1 }}></Box>
        <Box>
          <Button onClick={handleNewProject} variant="outlined" size="small" startIcon={<CreateNewFolderOutlinedIcon />}>
            New Project
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", p: 5 }}>
        <ProjectList projectList={projectList} setSelectedProject={setSelectedProject} />
      </Box>
      {currentUser && <NewProjectDialog open={openNewProjectDialog} setOpen={setOpenNewProjectDialog} handleCreateNewProject={handleCreateNewProject} />}
    </Box>
  );

  return selectedProject ? <Navigate to={"/" + selectedProject.uid} /> : content;
}
