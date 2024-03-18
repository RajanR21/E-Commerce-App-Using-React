import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "",
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action) {
      console.log(action.payload);
      state.data = action.payload;
    },
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
