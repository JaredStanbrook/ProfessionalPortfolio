import { Link } from "@tanstack/react-router";
import type { FileRouteTypes } from "@/routeTree.gen";
import { useQuery } from "@tanstack/react-query";

import { getUserQueryOptions, useLogoutMutation } from "@/api/authApi";

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
    <div className="p-2 flex justify-between max-w-5xl m-auto items-baseline">
      <div className="flex items-center gap-x-4">
        <Link to="/">
          <h1 className="text-2xl font-bold">My Website</h1>
        </Link>
      </div>
      <div className="flex gap-x-6">
        <div className="flex gap-x-6">
          {menu.map(({ to, name }) => (
            <Link
              key={to}
              to={to}
              activeProps={{ className: "font-bold" }}
              activeOptions={{ exact: to === "/" }}>
              {name}
            </Link>
          ))}
        </div>
        {isUserPending && <div>Loading...</div>}

        {userError && (
          <div className="flex gap-x-6">
            <Link to={"/signup"} activeProps={{ className: `font-bold` }}>
              {"Create Account"}
            </Link>
            <Link to={"/login"} activeProps={{ className: `font-bold` }}>
              {"Login"}
            </Link>
          </div>
        )}

        {userData && (
          <div className="flex gap-2">
            <button onClick={handleLogout} disabled={logoutMutation.isPending}>
              Log out
            </button>
            <p> | </p>
            <div>Welcome back, {userData?.firstName}</div>
          </div>
        )}
      </div>
    </div>
  );
}
