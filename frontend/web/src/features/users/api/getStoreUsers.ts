import api from "../../../services/api/axios";
import type { ManagedUser } from "../types";

export async function getStoreUsers(): Promise<ManagedUser[]> {
  const response = await api.get<ManagedUser[]>("/users/store-users/");
  return response.data;
}
