import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTokenStore, signOut } from "../util/store";
import { useEffect, useState } from "react";
import "../index.css";
import { signIn } from "../util/auth";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => {
    const token = useTokenStore((state) => state.token);
    useEffect(() => {
      const localToken = localStorage.getItem("token");
      if (localToken) {
        signIn(localToken);
      }
    }, [token]);
    return (
      <QueryClientProvider client={queryClient}>
        <div className="p-2 flex gap-2 justify-space-between">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
          <Link to="/login" className="[&.active]:font-bold">
            Login
          </Link>
          <Link to="/about" className="[&.active]:font-bold">
            About
          </Link>
          {token && (
            <Link to="/transactions" className="[&.active]:font-bold">
              Transactions
            </Link>
          )}
          <Link to="/login" onClick={signOut}>
            Sign Out
          </Link>
        </div>
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
      </QueryClientProvider>
    );
  },
});
