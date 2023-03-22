import React from "react";
import { IProject } from "../../types/Project";
import TimeAgo from "react-timeago";

// MUI
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

type ProjectListProps = {
  projectList: IProject[];
  setSelected: (project: IProject) => void;
};

export default function ProjectList({ projectList, setSelected }: ProjectListProps) {
  return (
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
          {projectList.map((project) => (
            <TableRow
              hover={true}
              onClick={() => setSelected(project)}
              key={project.title}
              sx={{
                "&:last-child td, &:last-child th, c": { border: 0 },
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <TableCell align="left" width={200}>
                {project.title}
              </TableCell>
              <TableCell align="left">{project.description}</TableCell>
              <TableCell align="left" width={200}>
                <TimeAgo live={false} date={project.updated} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
