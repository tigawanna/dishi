import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
// import { queryKeyPrefixes } from "./data-access-layer/query-keys";
import { RouterErrorComponent } from "./lib/tanstack/router/routerErrorComponent";
import { RouterNotFoundComponent } from "./lib/tanstack/router/RouterNotFoundComponent";
import { RouterPendingComponent } from "./lib/tanstack/router/RouterPendingComponent";
import { routeTree } from "./routeTree.gen";
import "./styles.css";
import { queryClient } from "./lib/tanstack/query/queryclient";

// Set up a Router instance
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultViewTransition: true,
  defaultPendingComponent: () => <RouterPendingComponent />,
  defaultNotFoundComponent: () => <RouterNotFoundComponent />,
  defaultErrorComponent: ({ error }) => <RouterErrorComponent error={error} />,
  context: {
    queryClient,
    viewer: undefined,
  },
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
