import type { RouteObject } from "react-router-dom";

import { RoleProtectedRoute } from "../../components/auth/RoleProtectedRoute";
import { CreateProductPage } from "../../pages/product/CreateProductPage";
import { EditProductPage } from "../../pages/product/EditProductPage";
import StoreOwnerPage from "../../pages/store-owner/StoreOwnerPage";

export const storeOwnerRoutes: RouteObject[] = [
  {
    path: "store-owner",
    element: (
      <RoleProtectedRoute roles={["store_owner"]}>
        <StoreOwnerPage />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "store-owner/products/create",
    element: (
      <RoleProtectedRoute roles={["store_owner"]}>
        <CreateProductPage />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "store-owner/products/:productId/edit",
    element: (
      <RoleProtectedRoute roles={["store_owner"]}>
        <EditProductPage />
      </RoleProtectedRoute>
    ),
  },
];
