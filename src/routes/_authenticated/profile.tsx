// src/routes/_authenticated/profile.tsx

import { createFileRoute } from "@tanstack/react-router";
import { useLogoutMutation } from "@/api/authApi";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { user } = Route.useRouteContext();

  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="container flex-grow flex flex-col items-center justify-center py-12">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <div className="flex flex-col gap-2">
        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <p className="text-xs text-gray-500">
          <strong>ID:</strong> {user?.id}
        </p>
      </div>

      <Button className="my-4" onClick={handleLogout} disabled={logoutMutation.isPending}>
        {logoutMutation.isPending ? "Logging out..." : "Log out"}
      </Button>
    </div>
  );
}
