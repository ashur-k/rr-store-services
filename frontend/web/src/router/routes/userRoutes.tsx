import type { RouteObject } from "react-router-dom";

import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { EditProfilePage } from "../../pages/users/EditProfilePage";
import { ProfilePage } from "../../pages/users/ProfilePage";

export const userRoutes: RouteObject[] = [
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
];
