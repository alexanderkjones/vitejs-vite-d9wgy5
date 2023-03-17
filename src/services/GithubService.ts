import React from "react";
import { Octokit } from "@octokit/rest";
import { IGetAuthenticatedUserResponseDataType } from "../types/Octokit";

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

export async function getCurrentUserGithubProfileData(): Promise<IGetAuthenticatedUserResponseDataType> {
  const profile = await octokit.users.getAuthenticated();
  return profile.data;
}
