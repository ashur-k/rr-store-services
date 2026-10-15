import { useQuery } from "@tanstack/react-query";

import { getMyStores } from "../api/storeApi";
import type { Store } from "../types";
import { queryKeys } from "../../../services/api/queryKeys";

export const useMyStores = () => {
  return useQuery<Store[]>({
    queryKey: queryKeys.myStores,
    queryFn: getMyStores,
  });
};
