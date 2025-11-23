// src/routes/_authenticated/dashboard.tsx

import { createFileRoute } from "@tanstack/react-router";

// Define the route, automatically nested under /_authenticated
export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  // Access the data returned from the parent's beforeLoad
  const { user } = Route.useRouteContext();

  return (
    <div className="container flex-grow flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-bold">Welcome, {user.email.split("@")[0]}!</h1>
      <p className="text-sm text-muted-foreground mt-2">You are viewing protected content.</p>
    </div>
  );
}
