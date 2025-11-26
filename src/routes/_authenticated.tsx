import { getUserQueryOptions, logoutUser } from "@/api/authApi";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    const queryClient = context.queryClient;

    try {
      const data = await queryClient.ensureQueryData(getUserQueryOptions);
      return { user: data };
    } catch (err) {
      // Remove stale user data
      queryClient.removeQueries(getUserQueryOptions);
      await logoutUser();

      // Force redirect to login
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <Outlet />;
}
