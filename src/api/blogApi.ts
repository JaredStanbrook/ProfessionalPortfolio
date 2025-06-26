import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { handleResponseError, safeJson } from "@/lib/utils";

// Types for blog metadata and blog content
export interface BlogMetadata {
  filename: string;
  title: string;
  readTime: number;
  subject: string;
}

export interface BlogContent {
  content: string;
  metadata: BlogMetadata;
}

export const blog = api.blog;

// Fetch all blog metadata
export async function getAllBlogs() {
  const res = await blog.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }
  const data = await res.json();
  return data.blogs as BlogMetadata[];
}

export const getAllBlogsQueryOptions = queryOptions({
  queryKey: ["get-all-blogs"],
  queryFn: getAllBlogs,
  staleTime: Infinity,
});

// Fetch a single blog's MDX content
export async function getBlogContent(filename: string) {
  /*
  const res = await blog[":filename{.+\\.mdx}"].$get({
    param: { filename },
  });
  8*/
  const res = await blog.test.$get();
  if (!res.ok) {
    throw new Error("Blog not found");
  }
  const content = await res.text();
  return content;
}

// Upload or update a blog MDX file
export async function putBlogContent({ filename, content }: { filename: string; content: string }) {
  const res = await blog[":filename{.+\\.mdx}"].$put({
    param: { filename },
    body: content,
    headers: { "Content-Type": "text/mdx" },
  });
  await handleResponseError(res);
  return await res.json();
}

export function usePutBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putBlogContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getAllBlogsQueryOptions] });
    },
  });
}
