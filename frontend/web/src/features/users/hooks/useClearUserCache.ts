
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "../../../components/feedback/useToast";
import { getApiErrorMessage } from "../../../services/api/getApiErrorMessage";
import { queryKeys } from "../../../services/api/queryKeys";
import { clearUserCache } from "../api/clearUserCache";

export function useClearUserCache() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: clearUserCache,

    onSuccess: async (data) => {
      showToast(
        "success",
        `${data.message} ${data.deleted_keys} keys deleted.`,
      );

      await queryClient.invalidateQueries({
        queryKey: queryKeys.storesWithOwners,
      });
    },

    onError: (error) => {
      showToast("error", getApiErrorMessage(error));
    },
  });
}
