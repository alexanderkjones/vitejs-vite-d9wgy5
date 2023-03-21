export interface IProjectList {
  [index: number]: IProject;
}

export interface IProject {
  uid: string;
  title: string;
  description: string;
  updated: number;
}
