import api from "../../../services/api/axios";
import type { UserResponse } from "../types";

export interface RegisterUserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}


export async function registerUser(
  data: RegisterUserData,
): Promise<UserResponse> {
  const response = await api.post<UserResponse>("/users/", data);

  return response.data;
}