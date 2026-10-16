import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../services/api/queryKeys";
import { getUsers } from "../api/getUsers";
import type { ManagedUser } from "../types";

export function useUsers() {
  return useQuery<ManagedUser[]>({
    queryKey: queryKeys.users,
    queryFn: getUsers,
  });
}
