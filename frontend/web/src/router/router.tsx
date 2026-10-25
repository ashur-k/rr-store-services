import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import { adminRoutes } from "./routes/adminRoutes";
import { publicRoutes } from "./routes/publicRoutes";
import { storeOwnerRoutes } from "./routes/storeOwnerRoutes";
import { userRoutes } from "./routes/userRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      ...publicRoutes,
      ...userRoutes,
      ...adminRoutes,
      ...storeOwnerRoutes,
    ],
  },
]);
