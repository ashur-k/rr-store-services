import api from "../../../services/api/axios";
import type { UserResponse } from "../types";

export interface CreateStoreUserData {
  first_name: string;
  last_name: string;
  email: string;
}

export async function createStoreUser(
  data: CreateStoreUserData,
): Promise<UserResponse> {
  const response = await api.post<UserResponse>("/users/store-users/", data);

  return response.data;
}
