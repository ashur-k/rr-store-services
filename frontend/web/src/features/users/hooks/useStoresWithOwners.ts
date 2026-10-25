import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../auth/useAuth";
import { getStoresWithOwners } from "../api/getStoresWithOwners";

export function useStoresWithOwners() {
  const { loading, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["stores-with-owners"],
    queryFn: getStoresWithOwners,
    enabled: !loading && isAuthenticated,
  });
}
