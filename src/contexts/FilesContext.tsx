import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { IFile, IFolder } from "../types/Files";
import { IProject } from "../types/Project";
import {
  initializeFileTree,
  getFileTree,
  addFile as _addFile,
  addFolder as _addFolder,
  removeFile as _removeFile,
  removeFolder as _removeFolder,
  renameFile as _renameFile,
  renameFolder as _renameFolder,
  moveFile as _moveFile,
  moveFolder as _moveFolder,
} from "../services/FileService";
import { IpcNetConnectOpts } from "net";

interface IFilesContext {
  files: IFolder;
  selectedFile: IFile;
  openFiles: IFile[];
  initFileTree: (project: IProject) => void;
  handleFileOpen: (item: IFile) => void;
  handleFileClose: (item: IFile) => void;
  handleFolderOpen: (item: IFolder) => void;
  handleFolderClose: (item: IFolder) => void;
  addFile: (destination: IFolder) => void;
  moveFile: (item: IFile, newParen: IFolder) => void;
  renameFile: (item: IFile, newName: string) => void;
  deleteFile: (item: IFile) => void;
  addFolder: (destination: IFolder) => void;
  moveFolder: (item: IFolder, newParent: IFolder) => void;
  renameFolder: (item: IFolder, newName: string) => void;
  deleteFolder: (item: IFolder) => void;
}

const FilesContext = createContext<IFilesContext>({
  files: {} as IFolder,
  selectedFile: {} as IFile,
  openFiles: [],
  initFileTree: () => {},
  handleFileOpen: () => {},
  handleFileClose: () => {},
  handleFolderOpen: () => {},
  handleFolderClose: () => {},
  addFile: () => {},
  moveFile: () => {},
  renameFile: () => {},
  deleteFile: () => {},
  addFolder: () => {},
  moveFolder: () => {},
  renameFolder: () => {},
  deleteFolder: () => {},
});

export function FilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<IFolder>({} as IFolder);
  const [openFiles, setOpenFiles] = useState<IFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<IFile>({} as IFile);

  const initFileTree = async (project: IProject) => {
    await initializeFileTree(project);
    setFiles({ ...getFileTree() });
  };

  const handleFileOpen = (item: IFile) => {
    item.open = true;
    if (!openFiles.find((tab) => tab.path === item.path)) {
      setOpenFiles([...openFiles, item]);
    }
    setSelectedFile(item);
    setFiles({ ...getFileTree() });
  };

  const handleFolderOpen = (item: IFolder) => {
    item.open = true;
    setFiles({ ...getFileTree() });
  };

  const handleFolderClose = (item: IFolder) => {
    item.open = false;
    setFiles({ ...getFileTree() });
  };

  const handleFileClose = (item: IFile) => {
    item.open = false;
    const index = openFiles.indexOf(item);
    setOpenFiles(openFiles.filter((tab) => tab.path !== item.path));
    if (index! >= openFiles.length) {
      setSelectedFile(openFiles[index]);
    } else {
      setSelectedFile(openFiles[openFiles.length - 1]);
    }
    setFiles({ ...getFileTree() });
  };

  const addFile = (destination: IFolder) => {
    _addFile("untitled", destination);
    setFiles({ ...getFileTree() });
  };

  const renameFile = (item: IFile, name: string) => {
    _renameFile(item, name);
    setFiles({ ...getFileTree() });
  };

  const moveFile = (item: IFile, destination: IFolder) => {
    _moveFile(item, destination);
    setFiles({ ...getFileTree() });
  };

  const deleteFile = (item: IFile) => {
    _removeFile(item);
    setFiles({ ...getFileTree() });
  };

  const addFolder = (destination: IFolder) => {
    _addFolder("untitled", destination);
    setFiles({ ...getFileTree() });
  };

  const renameFolder = (item: IFolder, name: string) => {
    _renameFolder(item, name);
    setFiles({ ...getFileTree() });
  };

  const moveFolder = (item: IFolder, destination: IFolder) => {
    _moveFolder(item, destination);
    setFiles({ ...getFileTree() });
  };

  const deleteFolder = (item: IFolder) => {
    _removeFolder(item);
    setFiles({ ...getFileTree() });
  };

  const value: IFilesContext = {
    files,
    selectedFile,
    openFiles,
    initFileTree,
    handleFileOpen,
    handleFileClose,
    handleFolderOpen,
    handleFolderClose,
    addFile,
    moveFile,
    renameFile,
    deleteFile,
    addFolder,
    moveFolder,
    renameFolder,
    deleteFolder,
  };

  return <FilesContext.Provider value={value}>{children}</FilesContext.Provider>;
}

export const useFiles = () => useContext(FilesContext);
