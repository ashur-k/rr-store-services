import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "../../../components/feedback/useToast";
import { getApiErrorMessage } from "../../../services/api/getApiErrorMessage";
import { queryKeys } from "../../../services/api/queryKeys";
import { createStore } from "../api/createStore";

export function useCreateStore() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: createStore,

    onSuccess: async () => {
      showToast("success", "Store created successfully.");

      await queryClient.invalidateQueries({
        queryKey: queryKeys.myStores,
      });
    },

    onError: (error) => {
      showToast("error", getApiErrorMessage(error));
    },
  });
}
