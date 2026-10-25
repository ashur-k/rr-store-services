import type { RouteObject } from "react-router-dom";

import { HomePage } from "../../pages/HomePage";
import { ProductDetailPage } from "../../pages/product/ProductDetailPage";
import { RegisterPage } from "../../pages/users/RegisterPage";

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: "products/:productId",
    element: <ProductDetailPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
];
