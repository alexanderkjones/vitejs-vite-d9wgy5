import { GetResponseTypeFromEndpointMethod, GetResponseDataTypeFromEndpointMethod } from "@octokit/types";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

export type IGithubAuthenticatedUserProfileData = GetResponseDataTypeFromEndpointMethod<typeof octokit.users.getAuthenticated>;
