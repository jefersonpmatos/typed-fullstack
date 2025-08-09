import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container border min-h-screen">
      <Outlet />
    </div>
  );
}
