import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../services/api/queryKeys";
import { getCurrentUser, type CurrentUser } from "../api/getCurrentUser";

export function useCurrentUser() {
  return useQuery<CurrentUser>({
    queryKey: queryKeys.currentUser,
    queryFn: getCurrentUser,
  });
}
