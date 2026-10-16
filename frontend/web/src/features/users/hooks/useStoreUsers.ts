import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../services/api/queryKeys";
import { getStoreUsers } from "../api/getStoreUsers";
import type { ManagedUser } from "../types";

export function useStoreUsers() {
  return useQuery<ManagedUser[]>({
    queryKey: queryKeys.users,
    queryFn: getStoreUsers,
  });
}
