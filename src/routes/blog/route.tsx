import { Button } from "@/components/ui/button";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center py-8">
        <Button variant="outline" onClick={() => navigate({ to: "/" })}>
          <span className="text-base">Back</span>
          <span className="text-xs ml-1 text-foreground/75">Back</span>
          <span className="text-tiny ml-1 text-foreground/50">Back</span>
        </Button>
      </div>
      <Outlet />
    </>
  );
}
