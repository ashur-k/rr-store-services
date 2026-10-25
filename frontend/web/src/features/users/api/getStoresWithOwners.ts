import api from "../../../services/api/axios";
import type { StoreWithOwner } from "../types";

export async function getStoresWithOwners(): Promise<StoreWithOwner[]> {
  const response = await api.get<StoreWithOwner[]>(
    "/users/stores-with-owners/",
  );

  return response.data;
}
