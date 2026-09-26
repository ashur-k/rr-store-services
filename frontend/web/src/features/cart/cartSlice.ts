import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
  id: string
  name: string
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload)
    },
  },
})

export const { addItem } = cartSlice.actions

export default cartSlice.reducer