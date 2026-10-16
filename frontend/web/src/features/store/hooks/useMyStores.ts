import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../services/api/queryKeys";
import { getMyStores } from "../api/storeApi";
import type { Store } from "../types";

export const useMyStores = () => {
  return useQuery<Store[]>({
    queryKey: queryKeys.myStores,
    queryFn: getMyStores,
  });
};
