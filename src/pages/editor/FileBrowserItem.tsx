import React, { useState, useRef, useEffect, MouseEventHandler, ChangeEventHandler } from "react";
import { IFile, IFolder } from "../../types/Files";
import { useFiles } from "../../contexts/FilesContext";

// MUI
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import TreeItem from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";

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
  expanded: boolean;
  handleExpandItem: (nodeId: string, value: boolean) => void;
  children?: React.ReactNode;
}

export default function FileBrowserItem({ nodeId, item, expanded, handleExpandItem, children }: FileBrowserItemProps) {
  const { handleFileOpen, handleFolderOpen, handleFolderClose } = useFiles();
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isRenaming, setIsRenaming] = useState(item.name === "untitled" ? true : false);

  const getItemIcon = (item: IFile | IFolder) => {
    if (item.type === "root") return;
    if (item.type === "folder") return expanded ? FolderOpenIcon : FolderIcon;
    if (item.type === "file") return DescriptionOutlinedIcon;
  };

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = (event) => {
    setIsHover(true);
  };

  const handleMouseOut: MouseEventHandler<HTMLDivElement> = (event) => {
    setIsHover(false);
  };

  const handleClick: MouseEventHandler<HTMLLIElement> = (event) => {
    if (item.type === "file") {
      handleFileOpen(item);
    } else {
      item.open ? handleFolderClose(item) : handleFolderOpen(item);
    }
  };

  return (
    <TreeItem
      nodeId={nodeId}
      onClick={handleClick}
      label={
        <Box component="div" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseOut} sx={{ flexDirection: "row", display: "flex" }}>
          <Box component={getItemIcon(item)} color="inherit" sx={{ mr: 1, fontSize: 18 }} />
          <ItemName item={item} isRenaming={isRenaming} setIsRenaming={setIsRenaming} />
          <Box sx={{ position: "absolute", right: 0, top: 0 }}>
            <ItemActions nodeId={nodeId} item={item} isHover={isHover} isRenaming={isRenaming} setIsRenaming={setIsRenaming} handleExpandItem={handleExpandItem} />
          </Box>
        </Box>
      }
    >
      {children}
    </TreeItem>
  );
}

interface ItemNameProps {
  item: IFile | IFolder;
  isRenaming: boolean;
  setIsRenaming: (value: boolean) => void;
}

function ItemName({ item, isRenaming, setIsRenaming }: ItemNameProps) {
  const { renameFolder, renameFile } = useFiles();
  const [name, setName] = useState<string>(item.name);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    isRenaming ? setSelectionEnd(name.indexOf(".")) : setSelectionStart(0);

    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(selectionStart, selectionEnd);
    }
  }, [isRenaming, inputRef.current]);

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    // Update the value and selection range
    const newValue = event.target.value;
    setName(newValue);
    setSelectionStart(newValue.length);
    setSelectionEnd(newValue.length);
  };

  const handleKeyDown = (key: string) => {
    if (key === "Escape") {
      setIsRenaming(false);
      setName(item.name);
      return;
    }
    if (key === "Enter" && item.type === "folder") {
      renameFolder(item, name);
      setIsRenaming(false);
      return;
    }
    if (key === "Enter" && item.type === "file") {
      renameFile(item, name);
      setIsRenaming(false);
      return;
    }
  };

  return isRenaming ? (
    <input value={name} onChange={handleOnChange} onKeyDown={(event) => handleKeyDown(event.key)} ref={inputRef} />
  ) : (
    <Typography variant="body2" sx={{ fontWeight: "inherit", fontSize: 13, flexGrow: 1 }}>
      {item.type != "root" ? item.name : "Files"}
    </Typography>
  );
}

interface ItemActionsProps {
  nodeId: string;
  item: IFile | IFolder;
  isHover: boolean;
  isRenaming: boolean;
  setIsRenaming: (value: boolean) => void;
  handleExpandItem: (nodeId: string, value: boolean) => void;
}

function ItemActions({ nodeId, item, isHover, isRenaming, setIsRenaming, handleExpandItem }: ItemActionsProps) {
  const { addFile, deleteFile, addFolder, deleteFolder } = useFiles();

  const addFileIcon = NoteAddOutlinedIcon;
  const renameFileIcon = ModeEditOutlineOutlinedIcon;
  const deleteFileIcon = DeleteOutlineOutlinedIcon;
  const addFolderIcon = CreateNewFolderOutlinedIcon;
  const renameFolderIcon = ModeEditOutlineOutlinedIcon;
  const deleteFolderIcon = DeleteOutlineOutlinedIcon;

  const folderItem = item.type === "folder" || item.type === "root" ? item : ({} as IFolder);
  const fileItem = item.type === "file" ? item : ({} as IFile);

  const handleAddFile: MouseEventHandler<SVGSVGElement> = (event) => {
    event.stopPropagation();
    handleExpandItem(nodeId, true);
    addFile(folderItem);
  };
  const handleRenameFile: MouseEventHandler<SVGSVGElement> = (event) => {
    event.stopPropagation();
    setIsRenaming(true);
  };

  const handleDeleteFile: MouseEventHandler<SVGSVGElement> = (event) => {
    event.stopPropagation();
    deleteFile(fileItem);
  };

  const handleAddFolder: MouseEventHandler<SVGSVGElement> = (event) => {
    event.stopPropagation();
    handleExpandItem(nodeId, true);
    addFolder(folderItem);
  };

  const handleRenameFolder: MouseEventHandler<SVGSVGElement> = (event) => {
    event.stopPropagation();
    setIsRenaming(true);
  };

  const handleDeleteFolder: MouseEventHandler<SVGSVGElement> = (event) => {
    event.stopPropagation();
    deleteFolder(folderItem);
  };

  return (
    <>
      {isHover && !isRenaming && fileItem.name && (
        <Box>
          <Box onClick={handleRenameFile} name="renameFile" component={renameFileIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
          <Box onClick={handleDeleteFile} name="deleteFile" component={deleteFileIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
        </Box>
      )}

      {isHover && !isRenaming && folderItem.name && (
        <Box>
          <Box onClick={handleAddFile} name="addFile" component={addFileIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
          <Box onClick={handleAddFolder} name="addFolder" component={addFolderIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
          <Box onClick={handleRenameFolder} name="renameFolder" component={renameFolderIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
          <Box onClick={handleDeleteFolder} name="deleteFolder" component={deleteFolderIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
        </Box>
      )}

      {isHover && !isRenaming && folderItem.type === "root" && (
        <Box>
          <Box onClick={handleAddFile} name="addFile" component={addFileIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
          <Box onClick={handleAddFolder} name="addFolder" component={addFolderIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
        </Box>
      )}
    </>
  );
}
