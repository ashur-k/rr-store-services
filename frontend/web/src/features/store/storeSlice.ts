import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Store, StoresState } from "./types";

const initialState: StoresState = { stores: [], selectedStoreId: null };

const storeSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    setStores(state, action: PayloadAction<Store[]>) {
      state.stores = action.payload;

      if (
        !state.selectedStoreId ||
        !action.payload.some((store) => store.id === state.selectedStoreId)
      ) {
        state.selectedStoreId = action.payload[0]?.id ?? null;
      }
    },

    setSelectedStoreId(state, action: PayloadAction<string>) {
      if (state.stores.some((store) => store.id === action.payload)) {
        state.selectedStoreId = action.payload;
      }
    },

    clearStores(state) {
      state.stores = [];
      state.selectedStoreId = null;
    },
  },
});

export const { setStores, setSelectedStoreId, clearStores } =
  storeSlice.actions;

export default storeSlice.reducer;
