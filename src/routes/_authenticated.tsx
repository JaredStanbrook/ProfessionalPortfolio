// src/routes/_authenticated.tsx (Your current implementation)

import { getUserQueryOptions, logoutUser } from "@/api/authApi";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    const queryClient = context.queryClient;

    // 1. Ensure Query Data: Tries to fetch the user if not cached,
    //    or returns cached data if available.
    const data = await queryClient.ensureQueryData(getUserQueryOptions);

    // 2. Guard Check
    if (!data) {
      // Clean up failed query and session data
      queryClient.removeQueries(getUserQueryOptions);
      await logoutUser();

      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
    // Data is valid, proceed and make the user data available to children
    return { user: data };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  // All authenticated content renders through the Outlet
  return <Outlet />;
}
