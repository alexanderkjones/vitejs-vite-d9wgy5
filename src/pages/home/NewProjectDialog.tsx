import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type NewProjectFormDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleCreateNewProject: (title: string, description: string) => void;
};

export default function NewProjectFormDialog({ open, setOpen, handleCreateNewProject }: NewProjectFormDialogProps) {
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const handleClose = () => {
    setOpen(false);
  };

  const handleTitleOnChange = (textfield: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const text = textfield.target.value;
    setTitle(text);
    console.log(text);
  };

  const handleDescriptionOnChange = (textfield: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const text = textfield.target.value;
    setDescription(text);
    console.log(text);
  };

  const handleCreate = () => {
    if (!title || !description) return;
    handleCreateNewProject(title, description);
    console.log("CREATE!");
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a new project!</DialogTitle>
        <DialogContent>
          <DialogContentText>To subscribe to this website, please enter your email address here. We will send updates occasionally.</DialogContentText>
          <TextField autoFocus onChange={handleTitleOnChange} required margin="dense" id="title" label="Title" type="text" fullWidth variant="standard" />
          <TextField onChange={handleDescriptionOnChange} margin="dense" id="description" label="Description" type="text" fullWidth variant="standard" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
