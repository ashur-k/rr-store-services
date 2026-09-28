import api from "../../../services/api/axios";

export async function deleteUser(userId: number): Promise<void> {
     await api.delete(`/users/${userId}/`);
}

