import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'


// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { getTanstackQueryContext } from './lib/tanstack/query/query-provider'
import { RouterPendingComponent } from './lib/tanstack/router/RouterPendingComponent'
import { RouterNotFoundComponent } from './lib/tanstack/router/RouterNotFoundComponent'
import { RouterErrorComponent } from './lib/tanstack/router/routerErrorComponent'

// Create a new router instance
export const getRouter = () => {
  const tanstackQueryContext = getTanstackQueryContext()

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

  setupRouterSsrQueryIntegration({ router, queryClient: tanstackQueryContext.queryClient })

  return router
}
