import { doc, getDoc, getDocs, setDoc, query, where, deleteDoc } from "@firebase/firestore";
import { createCollection } from "../firebase.js";
import { createGithubRepoForAuthenticated, getGithubRepoTree } from "../services/GithubService";

import { IProject } from "../types/Project";

const projectCollection = createCollection<IProject>("projects");

export async function createProject(title: string, description: string, userUID: string, isPrivate: boolean): Promise<IProject | null> {
  const repository = await createGithubRepoForAuthenticated(title, isPrivate);
  if (!repository) return null;
  console.log(repository);
  const projectDocRef = doc(projectCollection);
  const project: IProject = {
    uid: projectDocRef.id,
    title: title,
    description: description,
    userUID: userUID,
    updated: Date.now(),
    repo: { owner: repository.data.full_name.split("/")[0], name: repository.data.full_name.split("/")[1] },
  };
  const projectDoc = await setDoc(projectDocRef, project);
  return project;
}

export async function getProjectsByUserUID(userUID: string): Promise<IProject[]> {
  const result: IProject[] = [];
  const q = query(projectCollection, where("userUID", "==", userUID));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    result.push(doc.data());
  });
  return result;
}

export async function getProjectByUID(uid: string): Promise<IProject | null> {
  const projectDocRef = doc(projectCollection, uid);
  const projectDoc = await getDoc(projectDocRef);
  const project = projectDoc.data();
  return project ? project : null;
}

export async function updateProject(id: string, data: IProject) {}

export async function deleteProjectByUID(uid: string): Promise<void> {
  const projectDocRef = doc(projectCollection, uid);
  const projectDoc = await deleteDoc(projectDocRef);
}

// Files

export async function getProjectFiles(project: IProject, branch: string) {
  const fileTree = await getGithubRepoTree(project.repo.owner, project.repo.name, "main");
  const files = [];

  console.log(fileTree);
}
