import { useQuery } from "@tanstack/react-query";

import { getStoresWithOwners } from "../api/getStoresWithOwners";

export function useStoresWithOwners() {
  return useQuery({
    queryKey: ["stores-with-owners"],
    queryFn: getStoresWithOwners,
  });
}