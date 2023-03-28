import { getGithubRepoTree } from "../services/GithubService";
import { IProject } from "../types/Project";
import { IFileNode, IFolderNode } from "../types/Files";

export async function getFilesFromProject(project: IProject, branch: string) {
  const fileTree = await getGithubRepoTree(project.repo.owner, project.repo.name, "main");
  return createTree(fileTree);
}

function createTree(data: any): IFolderNode {
  const root: IFolderNode = {
    name: "",
    path: "",
    type: "root",
    children: [],
  };

  // Map of folder paths to their corresponding folder nodes
  const folderNodes: Record<string, IFolderNode> = {};

  // Map of file paths to their corresponding file nodes
  const fileNodes: Record<string, IFileNode> = {};

  // Add all folders to folderNodes
  data.data.tree
    .filter((node: any) => node.type === "tree")
    .forEach((node: any) => {
      const folderPath = node.path;
      const folderName = folderPath.split("/").pop() as string;
      const folderNode: IFolderNode = {
        name: folderName,
        path: folderPath,
        type: "folder",
        children: [],
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
      const fileNode: IFileNode = {
        name: fileName,
        path: filePath,
        type: "file",
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
