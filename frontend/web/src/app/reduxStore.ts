import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "../features/cart/cartSlice";
import storesReducer from "../features/store/storeSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    stores: storesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
