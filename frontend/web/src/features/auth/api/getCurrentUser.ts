import api from "../../../services/api/axios";


export interface CurrentUser {
  id: string;
  sub: string;
  email: string;
  first_name: string;
  last_name: string;
  realm_roles: string[];
  client_roles: string[];
  is_staff: boolean;
  is_superuser: boolean;
}

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await api.get("/users/me/");
  return response.data;
};

