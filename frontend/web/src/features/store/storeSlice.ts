
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Store } from "./types";

interface StoresState {
  stores: Store[];
  selectedStoreSlug: string | null;
}

const initialState: StoresState = {
  stores: [],
  selectedStoreSlug: null,
};

const storeSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    setStores(state, action: PayloadAction<Store[]>) {
      state.stores = action.payload;

      if (
        !state.selectedStoreSlug ||
        !action.payload.some(
          (store) => store.slug === state.selectedStoreSlug,
        )
      ) {
        state.selectedStoreSlug = action.payload[0]?.slug ?? null;
      }
    },

    setSelectedStoreSlug(state, action: PayloadAction<string>) {
      if (
        state.stores.some((store) => store.slug === action.payload)
      ) {
        state.selectedStoreSlug = action.payload;
      }
    },

    clearStores(state) {
      state.stores = [];
      state.selectedStoreSlug = null;
    },
  },
});

export const {
  setStores,
  setSelectedStoreSlug,
  clearStores,
} = storeSlice.actions;

export default storeSlice.reducer;
