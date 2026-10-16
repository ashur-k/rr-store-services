import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../services/api/queryKeys";
import { deleteUser } from "../api/deleteUser";

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
