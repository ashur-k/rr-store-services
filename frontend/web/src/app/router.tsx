import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { HomePage } from "../pages/HomePage";
import { ProfilePage } from "../pages/ProfilePage";
import { ManageUsersPage } from "../pages/ManageUsersPage";
import { RoleProtectedRoute } from "../components/auth/RoleProtectedRoute";
import { RegisterPage } from "../pages/RegisterPage";
import { EditProfilePage } from "../pages/EditProfilePage";

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
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "profile/edit",
        element: (
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        ),
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