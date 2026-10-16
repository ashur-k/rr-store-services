import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "../../../components/feedback/useToast";
import { getApiErrorMessage } from "../../../services/api/getApiErrorMessage";
import { queryKeys } from "../../../services/api/queryKeys";
import { deleteUser } from "../api/deleteUser";

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      showToast("success", "Store owner deleted successfully.");

      await queryClient.invalidateQueries({
        queryKey: queryKeys.users,
      });
    },
    onError: (error) => {
      showToast("error", getApiErrorMessage(error));
    },
  });
}
