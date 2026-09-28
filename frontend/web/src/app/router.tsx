import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { HomePage } from "../pages/HomePage";
import { ProfilePage } from "../pages/ProfilePage";
import { ManageUsersPage } from "../pages/ManageUsersPage";
import { RoleProtectedRoute } from "../components/auth/RoleProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/users",
        element: (
          <RoleProtectedRoute roles={["admin", "staff"]}>
            <ManageUsersPage />
          </RoleProtectedRoute>
        ),
      },
    ],
  },
]);