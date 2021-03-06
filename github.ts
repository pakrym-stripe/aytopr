import { Octokit } from "@octokit/rest";
import { components } from "@octokit/openapi-types";
import { Config } from "./config";

export type PullRequest = components["schemas"]["pull-request"];

export const getPRsSinceLastRelease = async (
  repo: Config
): Promise<PullRequest[]> => {
  const client = new Octokit({
    auth: repo.token,
    log: {
      debug: () => {},
      info: console.log,
      warn: console.warn,
      error: console.error
    },
  });
  
  const tags = await client.repos.listTags({
    owner: repo.org,
    repo: repo.repo,
    per_page: 1,
  });

  if (tags.data.length == 0) {
    throw new Error(`Didn't find any tags in ${repo.repo}`);
  }

  const tag = tags.data[0];

  const { data: commit } = await client.repos.getCommit({
    owner: repo.org,
    repo: repo.repo,
    ref: tag.commit.sha,
  });

  const commiter = commit.commit.committer;
  if (!commiter || !commiter.date) {
    throw new Error(`Can't determine commit time for tag ${tag.commit.sha}`);
  }

  const targetDate = new Date(commiter.date);

  const pullsRequest = client.pulls.list.endpoint.merge({
    owner: repo.org,
    repo: repo.repo,
    state: "closed",
    sort: "updated",
    direction: "desc",
    base: repo.branch,
    per_page: 100,
  });

  const prs: PullRequest[] = [];

  for await (const response of client.paginate.iterator<PullRequest>(
    pullsRequest
  )) {
    for (let pr of response.data) {
      if (pr.merged_at && new Date(pr.merged_at) > targetDate) {
        prs.push(pr);
      }

      if (new Date(pr.updated_at) < targetDate)
      {
        return prs;
      }
    }
  }

  return prs;
};
