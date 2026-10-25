import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../app/reduxStore";
import { setSelectedStoreId, setStores } from "../storeSlice";
import { useMyStores } from "./useMyStores";

export function useOwnerStores() {
  const dispatch = useDispatch<AppDispatch>();
  const query = useMyStores();

  const selectedStoreId = useSelector(
    (state: RootState) => state.stores.selectedStoreId,
  );

  useEffect(() => {
    if (query.data) {
      dispatch(setStores(query.data));
    }
  }, [dispatch, query.data]);

  const activeStore =
    query.data?.find((store) => store.id === selectedStoreId) ??
    query.data?.[0];

  const activeStoreId = activeStore?.id ?? "";

  function selectStore(id: string) {
    dispatch(setSelectedStoreId(id));
  }

  return {
    ...query,
    stores: query.data ?? [],
    selectedStoreId: activeStoreId,
    selectStore,
  };
}
