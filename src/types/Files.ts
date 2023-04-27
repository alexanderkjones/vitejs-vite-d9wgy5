export interface IFileTree {
  tree: IFolder;
  repo: IRepo;
  newFiles: { [key: string]: IFile };
  newFolders: { [key: string]: IFolder };
  modifiedFiles: { [key: string]: IFile };
  unsavedChanges: { [key: string]: { content: any } };
  removedFiles: { [key: string]: IFile };
  removedFolders: { [key: string]: IFolder };
}

export interface IRepo {
  owner: string;
  name: string;
  branch: string;
}

export interface IFile {
  name: string;
  path: string;
  type: "file";
  content?: string;
  modified: boolean;
  open: boolean;
}

export interface IFolder {
  name: string;
  path: string;
  type: "folder" | "root";
  children: (IFolder | IFile)[];
  open: boolean;
}
