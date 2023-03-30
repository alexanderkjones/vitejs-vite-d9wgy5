export interface IFileTree {
  tree: IFolder | null;
  newFiles: { [key: string]: IFile };
  newFolders: { [key: string]: IFolder };
  modifiedFiles: { [key: string]: IFile };
  removedFiles: { [key: string]: IFile };
  removedFolders: { [key: string]: IFolder };
}

export interface IFile {
  name: string;
  path: string;
  type: "file";
  content?: string;
  modified: boolean;
}

export interface IFolder {
  name: string;
  path: string;
  type: "folder" | "root";
  children: (IFolder | IFile)[];
}
