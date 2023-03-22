export interface IProject {
  uid: string;
  title: string;
  description: string;
  userUID: string;
  updated: number;
  repo: {
    owner: string | null | undefined;
    name: string;
  };
}
