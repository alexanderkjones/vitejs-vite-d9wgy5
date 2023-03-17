import React from "react";

const TOKEN_KEY = import.meta.env.VITE_LOCAL_STORAGE_GITHUB_ACCESS_TOKEN_KEY;

export function setLocalGithubAccessToken(token: string | null): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

export function getLocalGithubAccessToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? JSON.parse(token) : null;
}

export function clearLocalGithubAccessToken(): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(null));
}

