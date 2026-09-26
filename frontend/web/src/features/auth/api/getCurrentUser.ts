import api from "../../../services/api/axios";

export interface CurrentUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await api.get("/users/me/");
  return response.data;
};