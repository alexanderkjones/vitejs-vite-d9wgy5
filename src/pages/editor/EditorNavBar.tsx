import NavBar from "../../components/NavBar";
import { IProject } from "../../types/Project";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";

interface EditorNavBarProps {
  project: IProject | null;
}

export default function EditorNavBar({ project }: EditorNavBarProps) {
  return (
    <NavBar>
      {project && (
        <Button variant="contained" size="small" startIcon={<SaveIcon />}>
          Save
        </Button>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <Typography align="center">{project && project.title + " : " + project.uid}</Typography>
      </Box>
    </NavBar>
  );
}
