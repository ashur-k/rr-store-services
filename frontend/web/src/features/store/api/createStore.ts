import api from "../../../services/api/axios";

export interface CreateStoreData {
  name: string;
  slug: string;
  description: string;
  owner_id: string;
}

export async function createStore(data: CreateStoreData) {
  const response = await api.post("/stores/", data);
  return response.data;
}
