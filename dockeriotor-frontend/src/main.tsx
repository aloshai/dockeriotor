import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Index } from "./pages/index.tsx";
import { Workers } from "./pages/workers";
import { DefaultLayout } from "./layouts/default.layout.tsx";
import "react-tooltip/dist/react-tooltip.css";
import { CreateWorker } from "./pages/workers/create.tsx";
import { DiscordCallback } from "./pages/callback/discord.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthLoader } from "./lib/auth.tsx";
import { TelegramCallback } from "./pages/callback/telegram.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "",
        element: <Index />,
      },
      {
        path: "workers",
        element: (
          <AuthLoader>
            <Workers />
          </AuthLoader>
        ),
      },
      {
        path: "workers/create",
        element: (
          <AuthLoader>
            <CreateWorker />
          </AuthLoader>
        ),
      },
      {
        path: "discord/callback",
        element: <DiscordCallback />,
      },
      {
        path: "telegram/callback",
        element: <TelegramCallback />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer theme="dark" />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
