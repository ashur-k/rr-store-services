import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { HomePage } from "../pages/HomePage";
import { ProfilePage } from "../pages/users/ProfilePage";
import { ManageUsersPage } from "../pages/users/ManageUsersPage";
import { RoleProtectedRoute } from "../components/auth/RoleProtectedRoute";
import { RegisterPage } from "../pages/users/RegisterPage";
import { EditProfilePage } from "../pages/users/EditProfilePage";
import { StorePage } from "../pages/store/StorePage";
import { CreateStorePage } from "../pages/store/CreateStorePage";

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
        path: "manage-users",
        element: (
          <RoleProtectedRoute roles={["admin", "staff"]}>
            <ManageUsersPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "store",
        element: (
          <ProtectedRoute>
            <StorePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "store/create",
        element: (
          <RoleProtectedRoute roles={["admin", "staff"]}>
            <CreateStorePage />
          </RoleProtectedRoute>
        ),
      },
    ],
  },
]);