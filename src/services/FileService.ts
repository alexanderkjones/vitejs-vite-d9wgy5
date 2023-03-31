import { getGithubRepoTree } from "../services/GithubService";
import { GithubTree } from "../types/Github";
import { IProject } from "../types/Project";
import { IFileTree, IFile, IFolder } from "../types/Files";

const fileTree: IFileTree = {
  tree: {} as IFolder,
  newFiles: {},
  newFolders: {},
  modifiedFiles: {},
  removedFiles: {},
  removedFolders: {},
};

export async function initializeFileTree(project: IProject, branch: string = "main") {
  fileTree.tree = await getFilesfromGithubTree(project, branch);
  return fileTree.tree;
}

export function getFileTree(): IFolder {
  return fileTree.tree;
}

export async function openFile(item: IFile) {
  if (fileTree.newFiles[item.path]) return fileTree.newFiles[item.path];
  if (fileTree.modifiedFiles[item.path]) return fileTree.modifiedFiles[item.path];

  const retrieved = getFileFolderOrParentFromTree(item);
  if (retrieved && retrieved.content) return retrieved;

  const content = await getFileContentsFromGithub(project, item);
  content ? (item.content = content) : null;
  return retrieved;
}

export function updateFile(item: IFile, content: string) {
  if (fileTree.newFiles[item.path]) {
    fileTree.newFiles[item.path].content = content;
    return;
  }
  if (fileTree.modifiedFiles[item.path]) {
    fileTree.modifiedFiles[item.path].content = content;
    return;
  }

  const retrieved = getFileFolderOrParentFromTree(item);
  if (retrieved && retrieved.type === "file") {
    retrieved.modified = true;
    retrieved.content = content;
    fileTree.modifiedFiles[retrieved.path] = retrieved;
  }
}

export function addFileOrFolder(item: IFile | IFolder): IFile | IFolder {
  let newItem;
  if (item.type === "file") {
    newItem = fileTree.newFiles[item.path] = item;
  } else {
    newItem = fileTree.newFolders[item.path] = item;
  }

  const parent = getFileFolderOrParentFromTree(newItem, true);

  if (parent && newItem && parent.type === "folder") {
    parent.children.push(newItem);
    parent.children.sort(compareFilesOrFoldersByName);
  }

  return newItem;
}

export function removeFileOrFolder(item: IFile | IFolder) {
  let removedItem: IFile | IFolder;

  if (item.type && item.type === "file") {
    removedItem = fileTree.removedFiles[item.path] = item;
    if (fileTree.newFiles[item.path]) delete fileTree.newFiles[item.path];
    if (fileTree.modifiedFiles[item.path]) delete fileTree.modifiedFiles[item.path];
  }

  if (item.type && item.type === "folder") {
    removedItem = fileTree.removedFolders[item.path] = item;
    for (const child of item.children) {
      removeFileOrFolder(child);
    }
    if (fileTree.newFolders[item.path]) delete fileTree.newFolders[item.path];
  }

  const parent = getFileFolderOrParentFromTree(item, true);

  if (parent && parent.type === "folder") {
    const index = parent.children.findIndex((i) => i.name === removedItem.name);
    if (index !== -1) {
      parent.children.splice(index, 1);
    }
  }
}

export function moveFileOrFolder(item: IFile | IFolder, newParent: IFolder) {
  if (item.type === "file") {
    addFileOrFolder({ ...item, path: newParent.path + "/" + item.name });
    removeFileOrFolder(item);
    return;
  }

  if (item.type == "folder") {
    const newFolder = addFileOrFolder({ ...item, path: newParent.path + "/" + item.name });
    for (const child of item.children) {
      moveFileOrFolder(child, newFolder);
    }
    removeFileOrFolder(item);
  }
}

export function renameFileOrFolder(item: IFile | IFolder, newName: string) {
  const path = item.path.split("/");
  const newPath = path.slice(0, -1).concat(newName).join("/");

  if (item.type === "file") {
    addFileOrFolder({ ...item, path: newPath });
    removeFileOrFolder(item);
    return;
  }

  if (item.type == "folder") {
    const newFolder = addFileOrFolder({ ...item, path: newPath });
    for (const child of item.children) {
      moveFileOrFolder(child, newFolder);
    }
    removeFileOrFolder(item);
  }
}

function getFileFolderOrParentFromTree(f: IFile | IFolder, getParent: boolean = false) {
  const path = f.path.split("/");
  const target = path.pop();
  let pointer = fileTree.tree?.children;
  for (const name of path) {
    const match = pointer?.find((child) => child.name === name);
    pointer = match?.children;
  }
  return pointer?.find((child) => child.name === target);
}

// export async function getFilesFromProject(project: IProject, branch: string) {
//   const fileTree = await getGithubRepoTree(project.repo.owner, project.repo.name, "main");
//   return createTree(fileTree);
// }

// export function commitFiles(){

// }

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

function compareFilesOrFoldersByName(a: IFile | IFolder, b: IFile | IFolder) {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  } else {
    return 0;
  }
}
