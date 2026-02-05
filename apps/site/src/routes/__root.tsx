import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'


import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { TanstackDevtools } from '@/lib/tanstack/devtools/devtools'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Dishi',
        description: 'Dishi is a hyperlocal food discovery platform connecting neighborhood kitchens with nearby customers.',
        keywords: 'food, discovery, hyperlocal, neighborhood, kitchens, nearby customers',
        og: {
          title: 'Dishi',
          description: 'Dishi is a hyperlocal food discovery platform connecting neighborhood kitchens with nearby customers.',
          image: 'https://dishi.app/og.png',
          url: 'https://dishi.app',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          image: 'https://dishi.app/og.png',
        },
        facebook: {
          appId: '1234567890',
        },
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanstackDevtools/>
        <Scripts />
      </body>
    </html>
  );
}
