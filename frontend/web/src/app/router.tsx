import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { RoleProtectedRoute } from "../components/auth/RoleProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import { HomePage } from "../pages/HomePage";
import { CreateStorePage } from "../pages/store/CreateStorePage";
import { StorePage } from "../pages/store/StorePage";
import { CreateStoreUserPage } from "../pages/users/CreateStoreUserPage";
import { EditProfilePage } from "../pages/users/EditProfilePage";
import { ManageUsersPage } from "../pages/users/ManageUsersPage";
import { ProfilePage } from "../pages/users/ProfilePage";
import { RegisterPage } from "../pages/users/RegisterPage";

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
          <RoleProtectedRoute roles={["admin"]}>
            <StorePage />
          </RoleProtectedRoute>
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
      {
        path: "store/users/create",
        element: (
          <RoleProtectedRoute roles={["admin"]}>
            <CreateStoreUserPage />
          </RoleProtectedRoute>
        ),
      },
    ],
  },
]);
