import React from "react";
import { Octokit } from "@octokit/rest";
import { GithubUser, GithubUserAuthenticated, GithubRepository, GithubRepositoryAuthenticatedUser } from "../types/Github";

const TOKEN_KEY = import.meta.env.VITE_LOCAL_STORAGE_GITHUB_ACCESS_TOKEN_KEY;

var octokit = new Octokit({ auth: getLocalGithubAccessToken() });

// AUTH TOKENS //

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

// USERS //

export async function getGithubUserByAuthenticated(): Promise<GithubUserAuthenticated> {
  return await octokit.rest.users.getAuthenticated();
}

export async function getGithubUserByUsername(username: string): Promise<GithubUser> {
  return await octokit.rest.users.getByUsername({ username });
}

// REPOS //

export async function createGithubRepoForAuthenticated(name: string, isPrivate: boolean): Promise<GithubRepositoryAuthenticatedUser | null> {
  try {
    return await octokit.rest.repos.createForAuthenticatedUser({
      name: name,
      private: isPrivate,
    });
  } catch (e) {
    return null;
  }
}

export async function getGithubRepositoriesByUsername(username: string) {}

export async function getGithubRepository(owner: string, repoName: string) {}
