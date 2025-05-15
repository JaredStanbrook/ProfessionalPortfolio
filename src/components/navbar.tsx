import { Link } from "@tanstack/react-router";
import type { FileRouteTypes } from "@/routeTree.gen";
import { useQuery } from "@tanstack/react-query";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { getUserQueryOptions, useLogoutMutation } from "@/api/authApi";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

type NavigationItem = {
  to: FileRouteTypes["to"];
  name: string;
};

const defaultMenu: NavigationItem[] = [
  {
    to: "/",
    name: "Home",
  },
  {
    to: "/profile",
    name: "Profile",
  },
  {
    to: "/unimark",
    name: "Unimark",
  },
];

const authMenu: NavigationItem[] = [
  {
    to: "/admin",
    name: "Home",
  },
  {
    to: "/admin/tenant",
    name: "Tenants",
  },
  {
    to: "/admin/bill",
    name: "Bills",
  },
  {
    to: "/admin/property",
    name: "Properties",
  },
];

export function NavBar() {
  const [open, setOpen] = useState(false);
  const {
    isPending: isUserPending,
    error: userError,
    data: userData,
  } = useQuery(getUserQueryOptions);

  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const menu = defaultMenu;

  return (
    <div className="fixed inset-0 z-[1000] text-white w-screen h-screen flex flex-col justify-center items-center gap-8 px-6 py-12">
      {/* Close button */}
      <Button variant="ghost" onClick={() => setOpen(true)} className="fixed top-4 right-4 z-50">
        |||
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black text-white w-screen h-screen max-w-none p-10 flex flex-col items-center justify-center gap-6">
          <DialogPrimitive.Close className="absolute right-4 top-4 ..."></DialogPrimitive.Close>
          xx
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"></Button>
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">My Website</h1>

            <nav className="flex flex-col gap-4 text-xl">
              {menu.map(({ to, name }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "font-bold underline" }}
                  activeOptions={{ exact: to === "/" }}>
                  {name}
                </Link>
              ))}
            </nav>

            <div className="mt-8">
              {isUserPending && <div>Loading...</div>}

              {userError && (
                <div className="flex flex-col gap-2 text-lg">
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    Create Account
                  </Link>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </div>
              )}

              {userData && (
                <div className="flex flex-col items-center gap-2 text-lg">
                  <span>Welcome back, {userData.firstName}</span>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}>
                    Log out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
