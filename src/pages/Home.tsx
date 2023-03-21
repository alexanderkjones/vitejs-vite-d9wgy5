import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import TimeAgo from "react-timeago";
import { IProject, IProjectList } from "../types/Project";

// MUI
import Box from "@mui/material/Box";
import NavBar from "../components/NavBar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";

function createProject(uid: string, title: string, description: string, updated: number) {
  return { uid, title, description, updated };
}

const rows = [createProject("43232hbroi23urh23jkb", "Test Project #1", "a really cool test project", Date.now()), createProject("345534234234hnbkjbkj", "Test Project #2", "a really cool test project #2", Date.now() - 5000)];

export default function Home() {
  const { currentUser } = useAuth();
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [projectList, setProjectList] = useState<IProjectList>([])

  useEffect(() => {
    
    const getProjectList = async (user: IUser) => {
      const projects = await getProjectsByUserId(user.uid);
      setProjectList(projects);
    };

    if(currentUser){
      getProjectList(currentUser.uid);
    }

  }, []);

  if (selectedProject) {
    return <Navigate to={"/" + selectedProject.uid} />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar />
      <Box sx={{ display: "flex", mt: 4, p: 5 }}>
        <Box>
          <Typography>Projects</Typography>
        </Box>
        <Box sx={{ display: "flex", flexGrow: 1 }}></Box>
        <Box>
          <Button variant="outlined" size="small" startIcon={<CreateNewFolderOutlinedIcon />}>
            New Project
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", p: 5 }}>
        <TableContainer component={Box}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Title</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="left">Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  hover={true}
                  onClick={() => setSelectedProject(row)}
                  key={row.title}
                  sx={{
                    "&:last-child td, &:last-child th, c": { border: 0 },
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell align="left" width={200}>
                    {row.title}
                  </TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="left" width={200}>
                    <TimeAgo live={false} date={row.updated} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
