import { githubRoute } from "@server/routes/github";
import { hc } from "hono/client";
import { queryOptions } from "@tanstack/react-query";
export const github = hc<typeof githubRoute>("/api/github");

interface GitHubErrorResponse {
  data?: {
    message?: string;
    documentation_url?: string;
    status?: string;
  };
  error?: string;
}

export async function getGitHubCommitData() {
  const res = await github.stats.commit_activity.$get();

  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  if (!data) {
    throw new Error("Server error");
  }
  console.log(data);
  return data;
}

export const getGitHubCommitDataQueryOptions = queryOptions({
  queryKey: ["get-github-commit-data"],
  queryFn: getGitHubCommitData,
  staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
});

export async function getGitHubCodeFrequency() {
  const res = await github.stats.code_frequency.$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

export const getGitHubCodeFrequencyQueryOptions = queryOptions({
  queryKey: ["get-github-code-frequency"],
  queryFn: getGitHubCodeFrequency,
  staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
});
