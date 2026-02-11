import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { data } = useSuspenseQuery({
    queryKey: ["hello"],
    queryFn: () => fetch("https://dummyjson.com/test").then((res) => res.json()),
  });

  console.log(data);
  return (
    <div className="min-h-screen">
      <h1>Hello World {data.method}</h1>
    </div>
  );
}
