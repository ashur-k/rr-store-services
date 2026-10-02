import api from "./axios";

export const getStoreHealth = async () => {
  const response = await api.get("/stores/health");
  return response.data;
};