import api from "../../../services/api/axios";

export interface UpdateUserData {
  first_name: string;
  last_name: string;
  email: string;
}

export async function updateUser(
  userId: string,
  data: UpdateUserData,
): Promise<void> {
  await api.patch(`/users/${userId}/`, data);
}