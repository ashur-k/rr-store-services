import api from "../../../services/api/axios";
import type {
  Product,
  ProductCategory,
  ProductColor,
  ProductCreate,
  ProductUpdate,
} from "./types";

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>("/products/");
  return response.data;
}

export async function getProductsByStore(storeId: string): Promise<Product[]> {
  const response = await api.get<Product[]>(
    `/products/store/${encodeURIComponent(storeId)}`,
  );
  return response.data;
}

export async function getCategories(): Promise<ProductCategory[]> {
  const response = await api.get<ProductCategory[]>("/products/categories/");
  return response.data;
}

export async function getProductById(productId: string): Promise<Product> {
  const response = await api.get<Product>(
    `/products/${encodeURIComponent(productId)}`,
  );

  return response.data;
}

export async function createProduct(
  storeId: string,
  productData: ProductCreate,
): Promise<Product> {
  const response = await api.post<Product>(
    `/products/store/${encodeURIComponent(storeId)}`,
    productData,
  );

  return response.data;
}

export async function getColors(): Promise<ProductColor[]> {
  const response = await api.get<ProductColor[]>("/products/colors/");
  return response.data;
}

export async function updateProduct(
  storeId: string,
  productId: string,
  productData: ProductUpdate,
): Promise<Product> {
  const response = await api.put<Product>(
    `/products/store/${encodeURIComponent(storeId)}/${encodeURIComponent(productId)}`,
    productData,
  );

  return response.data;
}

export async function deleteProduct(
  storeId: string,
  productId: string,
): Promise<void> {
  await api.delete(
    `/products/store/${encodeURIComponent(storeId)}/${encodeURIComponent(productId)}`,
  );
}
