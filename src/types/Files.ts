export interface IFileNode {
  name: string;
  path: string;
  type: "file";
}

export interface IFolderNode {
  name: string;
  path: string;
  type: "folder" | "root";
  children: (IFolderNode | IFileNode)[];
}

export interface IFileOrFolderNode {
  node: IFileNode | IFolderNode;
}
