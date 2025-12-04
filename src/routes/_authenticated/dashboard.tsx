// src/routes/_authenticated/dashboard.tsx

import { createFileRoute } from "@tanstack/react-router";

// Define the route, automatically nested under /_authenticated
export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserQueryOptions } from "@/api/authApi";

function Dashboard() {
  // Access the data returned from the parent's beforeLoad
  const { data: user } = useSuspenseQuery(getUserQueryOptions);

  return (
    <div className="container grow flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-bold">Welcome, {user.email!.split("@")[0]}!</h1>
      <p className="text-sm text-muted-foreground mt-2">You are viewing protected content.</p>
    </div>
  );
}
