import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { IProject } from "../types/Project";

type ProjectContextType = {
  currentProject: IProject | null;
};

export const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);

  const value = {
    currentProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {/* {!loading && children} */}
      {children}
    </ProjectContext.Provider>
  );
}

export function useAuth() {
  return useContext(ProjectContext) as ProjectContext;
}
