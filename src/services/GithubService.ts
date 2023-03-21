import React from "react";
import { Octokit } from "@octokit/rest";
import { IGithubAuthenticatedUserProfileData, ICreateForAuthenticatedUser } from "../types/Github";

const TOKEN_KEY = import.meta.env.VITE_LOCAL_STORAGE_GITHUB_ACCESS_TOKEN_KEY;

var octokit = new Octokit({ auth: getLocalGithubAccessToken() });

function updateOctokitAuthToken(token: string) {
  octokit = new Octokit({ auth: token });
}

export function setLocalGithubAccessToken(token: string | null): void {
  if (token) updateOctokitAuthToken(token);
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

export function getLocalGithubAccessToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) updateOctokitAuthToken(token);
  return token ? JSON.parse(token) : null;
}

export function clearLocalGithubAccessToken(): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(null));
}

export async function getCurrentUserGithubProfile(): Promise<IGithubAuthenticatedUserProfileData> {
  const profile = await octokit.users.getAuthenticated();
  return profile.data;
}

export async function getGithuProfile(username: string | null = null): Promise<IGithubAuthenticatedUserProfileData> {
  if (!username) {
    const user = await octokit.users.getAuthenticated();
  }
  return await octokit.rest.users.getByUsername({ username });
}

export async function getCurrentUserRepositories() {
  const list = await octokit.rest.repos.listForAuthenticatedUser();
  console.log(list);
  return list;
}

export async function createGithubRepository(name: string) {
  try {
    await octokit.rest.repos.createForAuthenticatedUser({
      name: name,
      private: false,
    });
  } catch (e) {
    console.log(e);
  }
}
