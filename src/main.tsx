import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

// Import your route tree and auth options
import { routeTree } from "./routeTree.gen";
import { getUserQueryOptions } from "./api/authApi";

const queryClient = new QueryClient();

// 1. Create Router with undefined context (it will be injected in InnerApp)
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!,
  },
  defaultPreload: "intent",
  // Optional: Default expiration for preloaded data
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// 2. Create an Inner Component to bridge React Query -> Router
function InnerApp() {
  // This hook runs globally and keeps 'user' state fresh
  const { data: user, isLoading } = useQuery(getUserQueryOptions);

  const authContext = {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
  };

  return <RouterProvider router={router} context={{ auth: authContext }} />;
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <InnerApp />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
