import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { handleResponseError } from "@/lib/utils";

// --- Types ---

export interface BlogMetadata {
  filename: string;
  title: string;
  readTime: number;
  subject: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  content: string;
  metadata: BlogMetadata;
}

// Access the blog route from your Hono client
export const blog = api.blog;

// --- API Functions ---

// 1. Fetch all blog metadata
export async function getAllBlogs() {
  const res = await blog.$get();

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  const data = await res.json();
  return data.blogs as BlogMetadata[];
}

export const getAllBlogsQueryOptions = queryOptions({
  queryKey: ["blogs"], // Simplified key
  queryFn: getAllBlogs,
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// 2. Fetch a single blog's content + metadata
export async function getBlogContent(filename: string) {
  const res = await blog[`:filename{.+\\.mdx}`].$get({
    param: { filename },
  });

  if (!res.ok) {
    throw new Error("Blog not found");
  }

  // FIX: Backend returns JSON { content, metadata }, not raw text
  const data = await res.json();
  return data as BlogPost;
}

export const getBlogContentQueryOptions = (filename: string) =>
  queryOptions({
    queryKey: ["blog", filename],
    queryFn: () => getBlogContent(filename),
    enabled: !!filename, // Only fetch if filename exists
  });

// 3. Upload or update a blog MDX file
export async function putBlogContent({ filename, content }: { filename: string; content: string }) {
  const res = await blog[`:filename{.+\\.mdx}`].$put({
    param: { filename },
    json: { body: content },
  });

  await handleResponseError(res);
  return await res.json();
}

// 4. Delete a blog file
export async function deleteBlogContent(filename: string) {
  const res = await blog[`:filename{.+\\.mdx}`].$delete({
    param: { filename },
  });

  await handleResponseError(res);
  return await res.json();
}

// --- Mutations ---

export function usePutBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putBlogContent,
    onSuccess: (data) => {
      // Invalidate the list of blogs
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      // Invalidate the specific blog if it was just updated
      queryClient.invalidateQueries({ queryKey: ["blog", data.filename] });
    },
  });
}

export function useDeleteBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlogContent,
    onSuccess: (data, variables) => {
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      // Remove the specific blog from cache
      queryClient.removeQueries({ queryKey: ["blog", variables] });
    },
  });
}
