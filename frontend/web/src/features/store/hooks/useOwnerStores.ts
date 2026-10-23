
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../app/store";
import { useMyStores } from "./useMyStores";
import { setSelectedStoreSlug, setStores } from "../storeSlice";

export function useOwnerStores() {
  const dispatch = useDispatch<AppDispatch>();
  const query = useMyStores();

  const selectedStoreSlug = useSelector(
    (state: RootState) => state.stores.selectedStoreSlug,
  );

  useEffect(() => {
    if (query.data) {
      dispatch(setStores(query.data));
    }
  }, [dispatch, query.data]);

  const activeStore =
    query.data?.find((store) => store.slug === selectedStoreSlug) ??
    query.data?.[0];

  const activeStoreSlug = activeStore?.slug ?? "";
  const activeStoreId = activeStore?.id ?? "";

  function selectStore(slug: string) {
    dispatch(setSelectedStoreSlug(slug));
  }

  return {
    ...query,
    stores: query.data ?? [],
    selectedStoreSlug: activeStoreSlug,
    selectedStoreId: activeStoreId,
    selectStore,
};
}
