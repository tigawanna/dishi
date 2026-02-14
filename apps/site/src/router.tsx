import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

// Import the generated route tree
import { getTanstackQueryContext } from "./lib/tanstack/query/query-provider";
import { RouterNotFoundComponent } from "./lib/tanstack/router/RouterNotFoundComponent";
import { RouterPendingComponent } from "./lib/tanstack/router/RouterPendingComponent";
import { RouterErrorComponent } from "./lib/tanstack/router/routerErrorComponent";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = async () => {
  const tanstackQueryContext = getTanstackQueryContext();
  const router = createRouter({
    routeTree,
    defaultPendingComponent: () => <RouterPendingComponent />,
    defaultNotFoundComponent: () => <RouterNotFoundComponent />,
    defaultErrorComponent: ({ error }) => <RouterErrorComponent error={error} />,
    context: {
      ...tanstackQueryContext,
    },
    defaultPreload: "intent",
  });

  setupRouterSsrQueryIntegration({ router, queryClient: tanstackQueryContext.queryClient });

  // if (process.env.LOG_DEBUG) {
  // router.subscribe("onBeforeLoad", console.log);
  // router.subscribe("onBeforeNavigate", console.log);
  // router.subscribe("onBeforeRouteMount", console.log);
  // router.subscribe("onLoad", console.log);
  // router.subscribe("onRendered", console.log);
  // router.subscribe("onResolved", console.log);
  // }

  return router;
};
