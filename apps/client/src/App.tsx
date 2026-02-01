import { RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";
import { themeChange } from "theme-change";

import { useViewer } from "./data-access-layer/users/viewer";
import { queryClient } from "./lib/tanstack/query/queryclient";
import { router } from "./main";

export function App() {
  useEffect(() => {
    document.documentElement.dataset.style = "vertical";
    themeChange(false);
  }, []);
  const { viewer } = useViewer();

  return (
    <>
      <RouterProvider
        router={router}
        defaultPreload="intent"
        context={{
          queryClient,
          viewer,
        }}
      />
    </>
  );
}
