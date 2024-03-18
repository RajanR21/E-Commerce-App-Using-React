import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "",
};

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    setBrands(state, action) {
      console.log(action.payload);
      state.data = action.payload;
    },
  },
});

export const { setBrands } = brandSlice.actions;
export default brandSlice.reducer;
