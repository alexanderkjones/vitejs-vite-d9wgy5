import { GetResponseTypeFromEndpointMethod, GetResponseDataTypeFromEndpointMethod } from "@octokit/types";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

export type IGetAuthenticatedUserResponseDataType = GetResponseDataTypeFromEndpointMethod<typeof octokit.users.getAuthenticated>;
