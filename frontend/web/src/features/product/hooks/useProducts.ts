import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProduct,
  deleteProduct,
  getCategories,
  getColors,
  getProductById,
  getProducts,
  getProductsByStore,
  updateProduct,
} from "../api/productApi";

import type { ProductCreate, ProductUpdate } from "../api/types";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}

export function useProduct(productId: string | undefined) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId!),
    enabled: Boolean(productId),
  });
}

export function useProductsByStore(storeId: string) {
  return useQuery({
    queryKey: ["products", "store", storeId],
    queryFn: () => getProductsByStore(storeId),
    enabled: Boolean(storeId),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: getCategories,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      productData,
    }: {
      storeId: string;
      productData: ProductCreate;
    }) => createProduct(storeId, productData),

    onSuccess: async (_product, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["products", "store", variables.storeId],
        }),
      ]);
    },
  });
}

export function useColors() {
  return useQuery({
    queryKey: ["product-colors"],
    queryFn: getColors,
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      productId,
      productData,
    }: {
      storeId: string;
      productId: string;
      productData: ProductUpdate;
    }) => updateProduct(storeId, productId, productData),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["products", "store", variables.storeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      productId,
    }: {
      storeId: string;
      productId: string;
    }) => deleteProduct(storeId, productId),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["products", "store", variables.storeId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["product", variables.productId],
        }),
      ]);
    },
  });
}
