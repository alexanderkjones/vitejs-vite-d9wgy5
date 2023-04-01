import React, { useState, useEffect, MouseEvent } from "react";
import { IProject } from "../../types/Project";
import { IFolder, IFile } from "../../types/Files";
import { initializeFileTree } from "../../services/FileService";
import { useFiles } from "../../contexts/FilesContext";
import FileBrowserItem from "./FileBrowserItem";

// MUI
import TreeView from "@mui/lab/TreeView";

// Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem/TreeItem";

interface FileBrowserProps {
  project: IProject;
}

export default function FileBrowser({ project }: FileBrowserProps) {
  const { initFileTree, files } = useFiles();

  useEffect(() => {
    const initialize = async () => {
      await initFileTree(project);
    };
    initialize();
  }, []);

  let itemCounter = 0;

  const renderFiles = (item: IFolder | IFile) => {
    const itemId = itemCounter++;
    if (item.type === "file") {
      return <FileBrowserItem nodeId={itemId.toString()} item={item} />;
    } else {
      return (
        <FileBrowserItem nodeId={itemId.toString()} item={item}>
          {item.children &&
            item.children
              .sort((a, b) => a.name.localeCompare(b.name)) // Sort the children alphabetically
              .map((child) => <React.Fragment key={child.name}>{renderFiles(child)}</React.Fragment>)}
        </FileBrowserItem>
      );
    }
  };

  return (
    <>
      {files ? (
        <TreeView
          aria-label="FileBrowser"
          defaultExpanded={["3"]}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultEndIcon={<div style={{ width: 24 }} />}
          sx={{ height: 264, flexGrow: 1, maxWidth: 275, overflowY: "auto" }}
        >
          {renderFiles(files)}
        </TreeView>
      ) : (
        <React.Fragment />
      )}
    </>
  );
}
