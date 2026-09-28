import api from "../../../services/api/axios";

export interface RegisterUserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface RegisterUserResponse {
  id: number;
  kc_id: string;
  email: string;
}

export async function registerUser(
  data: RegisterUserData,
): Promise<RegisterUserResponse> {
  const response = await api.post<RegisterUserResponse>("/users/", data);

  return response.data;
}