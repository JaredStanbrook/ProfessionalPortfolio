import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type QueryClient } from "@tanstack/react-query";
import { NavBar } from "@/components/navbar";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function Root() {
  return (
    <>
      {/*<NavBar />*/}
      <Outlet />
      <div className="print:hidden">
        <Toaster />
        <ReactQueryDevtools position="left" />
        <TanStackRouterDevtools position="bottom-left" />
      </div>
    </>
  );
}
