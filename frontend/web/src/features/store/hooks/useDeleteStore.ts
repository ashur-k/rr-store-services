import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteStore } from "../api/storeApi";

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-stores"],
      });
    },
  });
}
