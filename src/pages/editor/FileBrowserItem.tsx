import React, { useState, MouseEventHandler } from "react";
import { IFile, IFolder } from "../../types/Files";
import { useFiles } from "../../contexts/FilesContext";

// MUI
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import { SvgIconProps } from "@mui/material/SvgIcon";

// Icons
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

interface FileBrowserItemProps {
  nodeId: string;
  item: IFile | IFolder;
  children?: React.ReactNode;
  // add more props as needed
}

export default function FileBrowserItem({ nodeId, item, children }: FileBrowserItemProps) {
  const { addFile, renameFile, moveFile, deleteFile, addFolder, renameFolder, deleteFolder } = useFiles();
  const [isHover, setIsHover] = useState<boolean>(false);
  const [newName, setNewName] = useState(item.name);
  const [isRenaming, setIsRenaming] = useState(false);

  const textColorClosed = "#000000";
  const textColorOpened = "#FFFFFF";

  const getItemIcon = (item: IFile | IFolder) => {
    if (item.type === "folder" && !item.open) return FolderIcon;
    if (item.type === "folder" && item.open) return FolderOpenIcon;
    switch (item.name.split(".").pop()) {
      default: {
        return DescriptionOutlinedIcon;
      }
    }
  };

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = (event) => {
    setIsHover(true);
  };

  const handleMouseOut: MouseEventHandler<HTMLDivElement> = (event) => {
    setIsHover(false);
  };

  return (
    <TreeItem
      nodeId={nodeId}
      label={
        <Box component="div" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseOut} sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
          <Box component={getItemIcon(item)} color="inherit" sx={{ mr: 1, fontSize: 18 }} />
          {isRenaming && (
            <TextField
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  if (item.type === "folder") {
                    renameFolder(item, newName);
                  } else {
                    renameFile(item, newName);
                  }
                  setIsRenaming(false);
                } else if (event.key === "Escape") {
                  setIsRenaming(false);
                }
              }}
            />
          )}
          {!isRenaming && (
            <Typography variant="body2" sx={{ color: item.open ? textColorOpened : textColorClosed, fontWeight: "inherit", fontSize: 13, flexGrow: 1 }}>
              {item.type != "root" ? item.name : "Files"}
            </Typography>
          )}
          {!isRenaming && isHover && item.type === "file" ? (
            <Box>
              <Box onClick={() => setIsRenaming(true)} name="renameFile" component={ModeEditOutlineOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
              <Box onClick={() => deleteFile(item)} name="deleteFile" component={DeleteOutlineOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
            </Box>
          ) : !isRenaming && isHover && item.type === "folder" ? (
            <Box>
              <Box onClick={() => addFile(item)} name="newFile" component={NoteAddOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 15 }} />
              <Box onClick={() => addFolder(item)} name="newFolder" component={CreateNewFolderOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
              <Box onClick={() => setIsRenaming(true)} name="renameFolder" component={ModeEditOutlineOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
              <Box onClick={() => deleteFolder(item)} name="deleteFolder" component={DeleteOutlineOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
            </Box>
          ) : (
            <React.Fragment />
          )}
        </Box>
      }
    >
      {children}
    </TreeItem>
  );
}
