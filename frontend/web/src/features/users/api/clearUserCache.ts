
import api from "../../../services/api/axios";

export interface ClearUserCacheResponse {
  success: boolean;
  message: string;
  deleted_keys: number;
}

export async function clearUserCache(): Promise<ClearUserCacheResponse> {
  const response = await api.post<ClearUserCacheResponse>(
    "/users/admin/cache/clear/",
  );

  return response.data;
}
