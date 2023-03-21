import React from "react";
import { IProject } from "../types/Project";

export async function projectExists(userId:string, name:string):Promise<boolean>{
  const project = await getProject(userId, name);
  return project ? true : false;
}

export async function getProject(userId: string, name: string){

}

export async function getProjects(userID:string){

}

export async function createProject(name: string, repo:<IGithubRepository>|null = null) {
  const projectExists = await getProject(name);
  if(projectExists){

  }
  
}

export async function getProjects
