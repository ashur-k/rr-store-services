import type { RouteObject } from "react-router-dom";

import { RoleProtectedRoute } from "../../components/auth/RoleProtectedRoute";
import { CreateStorePage } from "../../pages/store/CreateStorePage";
import { StorePage } from "../../pages/store/StorePage";
import { CreateStoreUserPage } from "../../pages/users/CreateStoreUserPage";
import { ManageUsersPage } from "../../pages/users/ManageUsersPage";

export const adminRoutes: RouteObject[] = [
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
];
