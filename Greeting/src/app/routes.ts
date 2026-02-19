import { createBrowserRouter } from "react-router";
import { AuthLayout } from "./components/AuthLayout";
import { MainLayout } from "./components/MainLayout";
import { Dashboard } from "./components/Dashboard";
import { AddSubscription } from "./components/AddSubscription";
import { Calendar } from "./components/Calendar";
import { Settings } from "./components/Settings";
import { SubscriptionDetail } from "./components/SubscriptionDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthLayout,
  },
  {
    path: "/app",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "add", Component: AddSubscription },
      { path: "calendar", Component: Calendar },
      { path: "settings", Component: Settings },
      { path: "subscription/:id", Component: SubscriptionDetail },
    ],
  },
]);
