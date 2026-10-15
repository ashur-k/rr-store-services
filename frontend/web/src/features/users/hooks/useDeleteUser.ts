import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUser } from "../api/deleteUser";
import { queryKeys } from "../../../services/api/queryKeys";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users,
      });
    },
  });
}
