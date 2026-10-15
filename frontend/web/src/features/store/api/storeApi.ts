import api from "../../../services/api/axios";

export const getStoreHealth = async () => {
  const response = await api.get("/stores/health");
  return response.data;
};

export const getMyStores = async () => {
  const response = await api.get("/stores/all/");
  return response.data;
};