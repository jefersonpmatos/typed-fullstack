import { AuthContext } from "@/contexts/auth";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

interface MyRouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="container mx-auto min-h-screen">
      <Outlet />
    </div>
  ),
});
