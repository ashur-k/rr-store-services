import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "../../../components/feedback/useToast";
import { getApiErrorMessage } from "../../../services/api/getApiErrorMessage";
import { queryKeys } from "../../../services/api/queryKeys";
import { createStoreUser } from "../api/createStoreUser";

export function useCreateStoreUser() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: createStoreUser,

    onSuccess: async () => {
      showToast("success", "Store user created successfully.");

      await queryClient.invalidateQueries({
        queryKey: queryKeys.users,
      });
    },

    onError: (error) => {
      showToast("error", getApiErrorMessage(error));
    },
  });
}
