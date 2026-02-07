import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { pacerDevtoolsPlugin } from "@tanstack/react-pacer-devtools";

import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export function TanstackDevtools2() {
  return (
    <TanStackRouterDevtools
      position="bottom-right"
    />
  );
}

export function TanstackDevtools() {
  return (
    <TanStackDevtools
      config={{
        position: "bottom-right",
      }}
      plugins={[
        {
          name: "Tanstack Router",
          render: <TanStackRouterDevtoolsPanel />,

        },
        {
          name: "Tanstack Query",
          render: <ReactQueryDevtoolsPanel />,
        },
        pacerDevtoolsPlugin(),
      ]}
    />
  );
}
