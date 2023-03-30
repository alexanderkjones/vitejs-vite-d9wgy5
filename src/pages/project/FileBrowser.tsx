import React, { useState, useEffect, MouseEvent } from "react";
import { IFolderNode, IFileNode } from "../../types/Files";
import { getFilesFromProject } from "../../services/FileService";

// MUI
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";

// Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SaveIcon from "@mui/icons-material/Save";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { SvgIconProps } from "@mui/material/SvgIcon";
import { IProject } from "../../types/Project";

declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
  fileType: string;
  filePath: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

function StyledTreeItem(props: StyledTreeItemProps) {
  const { bgColor, color, labelIcon: LabelIcon, labelInfo, labelText, fileType, filePath, ...other } = props;
  const [isHover, setIsHover] = useState<boolean>(false);

  const handleMouseEnter = (event: MouseEvent) => {
    setIsHover(true);
  };

  const handleMouseOut = (event: MouseEvent) => {
    setIsHover(false);
  };

  const onClickHandler = (event: MouseEvent) => {
    event.stopPropagation();
    switch (event.currentTarget.getAttribute("name")) {
      case "newFile": {
        break;
      }
      case "newFolder": {
        break;
      }
    }
  };

  return (
    <StyledTreeItemRoot
      label={
        <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseOut} sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1, fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontWeight: "inherit", fontSize: 13, flexGrow: 1 }}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
          {isHover && fileType === "file" ? (
            <Box data-type={fileType} data-path={filePath}>
              <Box onClick={onClickHandler} name="edit" component={ModeEditOutlineOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
              <Box onClick={onClickHandler} name="delete" component={DeleteOutlineOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
            </Box>
          ) : isHover && fileType === "folder" ? (
            <Box data-type={fileType} data-path={filePath}>
              <Box onClick={onClickHandler} name="newFile" component={NoteAddOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 15 }} />
              <Box onClick={onClickHandler} name="newFolder" component={CreateNewFolderOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
              <Box onClick={onClickHandler} name="edit" component={ModeEditOutlineOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
              <Box onClick={onClickHandler} name="delete" component={DeleteOutlineOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
            </Box>
          ) : (
            <React.Fragment />
          )}
        </Box>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
      }}
      {...other}
    />
  );
}

interface FileBrowserProps {
  project: IProject | null;
}

export default function FileBrowser({ project }: FileBrowserProps) {
  const [projectFiles, setProjectFiles] = useState<IFolderNode | IFileNode | null>(null);

  useEffect(() => {
    const getFiles = async (p: IProject | null) => {
      if (!p) return;
      const projectFiles = await getFilesFromProject(p, "main");
      setProjectFiles(projectFiles);
    };

    getFiles(project);
  }, []);

  let nodeIdCounter = 0;

  const renderTree = (treeData: IFileNode | IFolderNode | null) => {
    if (!treeData) return;

    const nodeId = nodeIdCounter++;

    if (treeData.type === "file") {
      return <StyledTreeItem nodeId={nodeId.toString()} labelText={treeData.name} fileType={treeData.type} filePath={treeData.path} labelIcon={DescriptionOutlinedIcon} bgColor="#e8f0fe" />;
    } else {
      return (
        <StyledTreeItem nodeId={nodeId.toString()} labelText={treeData.type === "root" ? "FILES" : treeData.name} fileType={treeData.type} filePath={treeData.path} labelIcon={treeData.type === "root" ? null : FolderIcon} bgColor="#e8f0fe">
          {treeData.children
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort the children alphabetically
            .map((child) => (
              <React.Fragment key={child.name}>{renderTree(child)}</React.Fragment>
            ))}
        </StyledTreeItem>
      );
    }
  };

  return (
    <TreeView
      aria-label="gmail"
      defaultExpanded={["3"]}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ height: 264, flexGrow: 1, maxWidth: 275, overflowY: "auto" }}
    >
      {renderTree(projectFiles)}
    </TreeView>
  );
}
