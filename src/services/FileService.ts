import { getGithubRepoTree, getGithubRepoFileContent } from "../services/GithubService";
import { GithubTree } from "../types/Github";
import { IProject } from "../types/Project";
import { IFileTree, IFile, IFolder, IRepo } from "../types/Files";

const fileTree: IFileTree = {
  tree: {} as IFolder,
  repo: {} as IRepo,
  newFiles: {},
  newFolders: {},
  modifiedFiles: {},
  unsavedChanges: {},
  removedFiles: {},
  removedFolders: {},
};

export async function initializeFileTree(project: IProject, branch: string = "main") {
  fileTree.repo = { owner: project.repo.owner, name: project.repo.name, branch: branch };
  fileTree.tree = await getFilesfromGithubTree(project, branch);
  return fileTree.tree;
}

export function getFileTree(): IFolder {
  return fileTree.tree;
}

export function addFile(name: string, destination: IFolder, content: string = "") {
  const file = createFile(name, destination, content);
  const parent = getParent(file);
  parent.children.push(file);
  parent.children.sort(compareFilesOrFoldersByName);
  fileTree.newFiles[file.path] = file;
  return file;
}

export function addFolder(name: string, destination: IFolder) {
  const folder = createFolder(name, destination);
  const parent = getParent(folder);
  parent.children.push(folder);
  parent.children.sort(compareFilesOrFoldersByName);
  fileTree.newFolders[folder.path] = folder;
  return folder;
}

export function removeFile(item: IFile) {
  const file = (fileTree.removedFiles[item.path] = item);
  const parent = getParent(file);
  fileTree.newFiles[file.path] ? delete fileTree.newFiles[file.path] : null;
  fileTree.modifiedFiles[file.path] ? delete fileTree.modifiedFiles[file.path] : null;
  parent.children = parent.children.filter((child: IFile | IFolder) => child !== file);
}

export function removeFolder(item: IFolder) {
  const folder = (fileTree.removedFolders[item.path] = item);
  const parent = getParent(folder);
  fileTree.newFolders[folder.path] ? delete fileTree.newFiles[folder.path] : null;
  parent.children = parent.children.filter((child: IFile | IFolder) => child !== folder);
  if (folder.children) {
    for (const child of folder.children) {
      child.type === "file" ? removeFile(child) : null;
      child.type === "folder" ? removeFolder(child) : null;
    }
  }
}

export function moveFile(item: IFile, destination: IFolder) {
  addFile(item.name, destination, item.content);
  removeFile(item);
}

export function moveFolder(item: IFolder, destination: IFolder) {
  const folder = addFolder(item.name, destination);
  if (item.children) {
    for (const child of item.children) {
      child.type === "file" ? moveFile(child, folder) : null;
      child.type === "folder" ? moveFolder(child, folder) : null;
    }
  }
}

export function renameFile(item: IFile, name: string) {
  const destination = getParent(item);
  addFile(name, destination, item.content);
  removeFile(item);
}

export function renameFolder(item: IFolder, name: string) {
  const destination = getParent(item);
  const folder = addFolder(name, destination);
  if (item.children) {
    for (const child of item.children) {
      child.type === "file" ? moveFile(child, folder) : null;
      child.type === "folder" ? moveFolder(child, folder) : null;
    }
  }
  removeFolder(item);
}

export function getParent(item: IFile | IFolder) {
  const path = item.path.split("/");
  const target = path.pop();
  let pathPointer: IFolder = fileTree.tree;
  for (const pathPart of path) {
    if (pathPointer.children) {
      const result = pathPointer.children.find((child) => child.name === pathPart && child.type === "folder");
      result && result.type === "folder" ? (pathPointer = result) : null;
    }
  }
  return pathPointer;
}

export async function getFileContent(item: IFile) {
  if (!item.content) {
    item.content = await getGithubRepoFileContent(fileTree.repo.owner, fileTree.repo.name, item.path, fileTree.repo.branch);
  }
  return item.content;
}

async function getFilesfromGithubTree(project: IProject, branch: string = "main"): IFolder {
  const data = await getGithubRepoTree(project.repo.owner, project.repo.name, branch);
  const root: IFolder = {
    name: "",
    path: "",
    type: "root",
    children: [],
  };

  // Map of folder paths to their corresponding folder nodes
  const folderNodes: Record<string, IFolder> = {};

  // Map of file paths to their corresponding file nodes
  const fileNodes: Record<string, IFile> = {};

  // Add all folders to folderNodes
  data.data.tree
    .filter((node: any) => node.type === "tree")
    .forEach((node: any) => {
      const folderPath = node.path;
      const folderName = folderPath.split("/").pop() as string;
      const folderNode: IFolder = {
        name: folderName,
        path: folderPath,
        type: "folder",
        children: [],
        open: false,
      };

      folderNodes[folderPath] = folderNode;

      // Add folderNode to its parent folder's children array
      const parentFolderPath = folderPath.split("/").slice(0, -1).join("/");
      if (parentFolderPath in folderNodes) {
        folderNodes[parentFolderPath].children.push(folderNode);
      } else {
        root.children.push(folderNode);
      }
    });

  // Add all files to fileNodes
  data.data.tree
    .filter((node: any) => node.type === "blob")
    .forEach((node: any) => {
      const filePath = node.path;
      const fileName = filePath.split("/").pop() as string;
      const fileNode: IFile = {
        name: fileName,
        path: filePath,
        type: "file",
        modified: false,
        open: false,
      };

      fileNodes[filePath] = fileNode;

      // Add fileNode to its parent folder's children array
      const parentFolderPath = filePath.split("/").slice(0, -1).join("/");
      if (parentFolderPath in folderNodes) {
        folderNodes[parentFolderPath].children.push(fileNode);
      } else {
        root.children.push(fileNode);
      }
    });

  return root;
}

export function createFile(name: string, destination: IFolder, content: string = "") {
  const path = destination.type != "root" ? destination.path + "/" + name : name;
  return {
    name: name,
    path: path,
    type: "file",
    modified: false,
    content: content,
    open: false,
  } as IFile;
}

export function createFolder(name: string, destination: IFolder) {
  const path = destination.type != "root" ? destination.path + "/" + name : name;
  return {
    name: name,
    path: path,
    type: "folder",
    children: [],
    open: false,
  } as IFolder;
}

// export function generateFileOrFolder(type: "file" | "folder", name: string, parent: IFolder) {
//   const path = parent.type != "root" ? parent.path + "/" + name : name;
//   if (type === "file") {
//     const item: IFile = {
//       name: name,
//       path: path,
//       type: "file",
//       modified: false,
//       open: false,
//     };
//     return item;
//   } else {
//     const item: IFolder = {
//       name: name,
//       path: path,
//       type: "folder",
//       children: [],
//       open: false,
//     };
//     return item;
//   }
// }

function compareFilesOrFoldersByName(a: IFile | IFolder, b: IFile | IFolder) {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  } else {
    return 0;
  }
}
