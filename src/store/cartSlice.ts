import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  price: number;
  [key: string]: any;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload);
      state.total += action.payload.price;
    },
    removeFromCart(state, action: PayloadAction<{ id: string; price: number }>) {
      state.items = state.items.filter(i => i.id !== action.payload.id);
      state.total -= action.payload.price;
    },
    clearCart() {
      return initialState;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
