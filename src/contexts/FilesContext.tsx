import React, { useState, createContext, useContext, ReactNode } from "react";
import { IFile, IFolder } from "../types/Files";
import { IProject } from "../types/Project";
import { initializeFileTree, getFileTree, addFileOrFolder, renameFileOrFolder, moveFileOrFolder, removeFileOrFolder } from "../services/FileService";
import { IpcNetConnectOpts } from "net";

interface IFilesContext {
  files: IFolder;
  selectedFile: IFile;
  openFiles: IFile[];
  initFileTree: (project: IProject) => void;
  handleFileOpen: (item: IFile) => void;
  handleFileClose: (item: IFile) => void;
  addFile: (item: IFile) => void;
  moveFile: (item: IFile, newParen: IFolder) => void;
  renameFile: (item: IFile, newName: string) => void;
  deleteFile: (item: IFile) => void;
  addFolder: (item: IFolder) => void;
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
    setFiles(getFileTree());
  };

  const handleFileOpen = (item: IFile) => {
    item.open = true;
    if (!openFiles.find((tab) => tab.path === item.path)) {
      setOpenFiles([...openFiles, item]);
    }
    setSelectedFile(item);
    setFiles(getFileTree());
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
    setFiles(getFileTree());
  };

  const addFile = (item: IFile) => {
    addFileOrFolder(item);
    setFiles(getFileTree());
  };

  const renameFile = (item: IFile, newName: string) => {
    renameFileOrFolder(item, newName);
    setFiles(getFileTree());
  };

  const moveFile = (item: IFile, newParent: IFolder) => {
    moveFileOrFolder(item, newParent);
    setFiles(getFileTree());
  };

  const deleteFile = (item: IFile) => {
    removeFileOrFolder(item);
    setFiles(getFileTree());
  };

  const addFolder = (item: IFolder) => {
    addFileOrFolder(item);
    setFiles(getFileTree());
  };

  const renameFolder = (item: IFolder, newName: string) => {
    renameFileOrFolder(item, newName);
    setFiles(getFileTree());
  };

  const moveFolder = (item: IFolder, newParent: IFolder) => {
    moveFileOrFolder(item, newParent);
    setFiles(getFileTree());
  };

  const deleteFolder = (item: IFolder) => {
    removeFileOrFolder(item);
    setFiles(getFileTree());
  };

  const value: IFilesContext = {
    files,
    selectedFile,
    openFiles,
    initFileTree,
    handleFileOpen,
    handleFileClose,
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
