import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../auth/useAuth";
import { getStoresWithOwners } from "../api/getStoresWithOwners";
import { queryKeys } from "../../../services/api/queryKeys";

export function useStoresWithOwners() {
  const { loading, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.storesWithOwners,
    queryFn: getStoresWithOwners,
    enabled: !loading && isAuthenticated,
  });
}
