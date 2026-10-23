import { useQuery } from "@tanstack/react-query";

import { getProducts, getProductsByStore } from "../api/productApi";
import { getCategories } from "../api/productApi";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}


export function useProductsByStore(storeSlug: string) {
  return useQuery({
    queryKey: ["products", "store", storeSlug],
    queryFn: () => getProductsByStore(storeSlug),
    enabled: Boolean(storeSlug),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: getCategories,
  });
}