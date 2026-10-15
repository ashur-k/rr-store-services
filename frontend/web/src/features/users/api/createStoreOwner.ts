import api from "../../../services/api/axios";
import type { UserResponse } from "../types";

export interface CreateStoreOwnerData {
  first_name: string;
  last_name: string;
  email: string;
  store_name: string;
  store_slug: string;
}

export async function createStoreOwner(
  data: CreateStoreOwnerData,
): Promise<UserResponse > {
  const response = await api.post<UserResponse >(
    "/users/create-store-owners/",
    data,
  );

  return response.data;
}