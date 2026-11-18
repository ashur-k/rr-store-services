import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../services/api/queryKeys";
import { getCurrentUser, type CurrentUser } from "../api/getCurrentUser";

interface UseCurrentUserOptions {
  enabled?: boolean;
}

export function useCurrentUser({
  enabled = true,
}: UseCurrentUserOptions = {}) {
  return useQuery<CurrentUser>({
    queryKey: queryKeys.currentUser,
    queryFn: getCurrentUser,
    enabled,
  });
}