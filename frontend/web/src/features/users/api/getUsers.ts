import api from "../../../services/api/axios";
import type { ManagedUser } from "../types";

export async function getUsers(): Promise<ManagedUser[]> {
  const response = await api.get<ManagedUser[]>("/users/");
  return response.data;
}