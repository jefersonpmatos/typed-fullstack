import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div>
      <p>teste asdasdasd</p>
    </div>
  );
}
