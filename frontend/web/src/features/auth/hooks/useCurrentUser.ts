import { useQuery } from "@tanstack/react-query";

import { getCurrentUser, type CurrentUser } from "../api/getCurrentUser";
import { queryKeys } from "../../../services/api/queryKeys";

export function useCurrentUser() {
  return useQuery<CurrentUser>({
    queryKey: queryKeys.currentUser,
    queryFn: getCurrentUser,
  });
}
