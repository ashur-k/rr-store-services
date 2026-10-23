import api from "../../../services/api/axios";
import type { Product, ProductCategory  } from "./types";

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>("/products/products/");
  return response.data;
}

export async function getProductsByStore(
  storeSlug: string,
): Promise<Product[]> {
  const response = await api.get<Product[]>(
    `/products/products/store/${encodeURIComponent(storeSlug)}`,
  );
  return response.data;
}

export async function getCategories(): Promise<ProductCategory[]> {
  const response = await api.get<ProductCategory[]>(
    "/products/products/categories/",
  );
  return response.data;
}