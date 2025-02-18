import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAuthenticated } from "../util/auth";
import "../index.css";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/login" className="[&.active]:font-bold">
          Login
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        {isAuthenticated() && (
          <Link
            to="/posts"
            search={{ q: "post1" }}
            className="[&.active]:font-bold"
          >
            Posts
          </Link>
        )}
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </QueryClientProvider>
  ),
});
