import { GetResponseTypeFromEndpointMethod, GetResponseDataTypeFromEndpointMethod } from "@octokit/types";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

export type GithubUserAuthenticated = GetResponseTypeFromEndpointMethod<typeof octokit.users.getAuthenticated>;
export type GithubUser = GetResponseTypeFromEndpointMethod<typeof octokit.users.getByUsername>;
export type GithubRepositoryAuthenticatedUser = GetResponseTypeFromEndpointMethod<typeof octokit.rest.repos.createForAuthenticatedUser>;
export type GithubRepository = GetResponseTypeFromEndpointMethod<typeof octokit.rest.repos.get>;
