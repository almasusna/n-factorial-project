import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../../util/auth";

export const Route = createFileRoute("/posts/")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      q: (search.q as string) || "",
    };
  },
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps: { q } }) => {
    const posts = ["post1", "post2", "post3"];
    return {
      posts: posts.filter((post) => post === q),
    };
  },
});

function RouteComponent() {
  const { posts } = Route.useLoaderData();
  // const { q } = Route.useSearch();
  return (
    <div>
      {posts.map((post: string) => (
        <div key={post}>
          <Link to="/posts/$postId" params={{ postId: post }}>
            {post}
          </Link>
        </div>
      ))}
    </div>
  );
}
