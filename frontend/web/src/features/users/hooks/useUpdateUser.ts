import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { queryKeys } from "../../../services/api/queryKeys";
import { useAuth } from "../../auth/useAuth";
import { updateUser, type UpdateUserData } from "../api/updateUser";

interface UpdateUserVariables {
  userId: string;
  data: UpdateUserData;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { refreshToken } = useAuth();

  return useMutation({
    mutationFn: ({ userId, data }: UpdateUserVariables) =>
      updateUser(userId, data),
    onSuccess: async () => {
      await refreshToken();
      await queryClient.invalidateQueries({
        queryKey: queryKeys.currentUser,
      });
      navigate("/profile");
    },
  });
}
