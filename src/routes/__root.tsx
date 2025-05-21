import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient } from "@tanstack/react-query";
import { ModeToggle } from "@/components/mode-toggle";

import "../index.css";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function Root() {
  return (
    <div className="bg-background leading-relaxed text-foreground antialiased">
      <div className="fixed flex flex-row gap-2 top-2.5 right-4 lg:w-full lg:flex-row lg:justify-between lg:right-0 lg:px-5 lg:top-4 z-50">
        <Link to={"/navigation"} className="lg:order-first">
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        </Link>
        <div className="lg:order-last">
          <ModeToggle />
        </div>
      </div>
      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
        <Outlet />
        <TanStackRouterDevtools />
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </div>
  );
}
