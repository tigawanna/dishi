import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import type { TViewer } from "@/data-access-layer/users/viewer";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { TanstackDevtools } from "@/lib/tanstack/devtools/devtools";
import { z } from "zod";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/tanstack/router/theme-provider";

interface MyRouterContext {
  queryClient: QueryClient;
  viewer?: TViewer;
}

const searchparams = z.object({
  globalPage: z.number().optional(),
  globalSearch: z.string().optional(),
});

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Dishi",
        description:
          "Dishi is a hyperlocal food discovery platform connecting neighborhood kitchens with nearby customers.",
        keywords: "food, discovery, hyperlocal, neighborhood, kitchens, nearby customers",
        og: {
          title: "Dishi",
          description:
            "Dishi is a hyperlocal food discovery platform connecting neighborhood kitchens with nearby customers.",
          image: "https://dishi.app/og.png",
          url: "https://dishi.app",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          image: "https://dishi.app/og.png",
        },
        facebook: {
          appId: "1234567890",
        },
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  validateSearch: (search) => searchparams.parse(search),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="dishi.theme">
          <TooltipProvider>
            {children}
            <TanstackDevtools />
          </TooltipProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
