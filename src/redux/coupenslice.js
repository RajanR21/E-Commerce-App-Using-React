import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "",
};

const coupenSlice = createSlice({
  name: "coupens",
  initialState,
  reducers: {
    setCoupens(state, action) {
      console.log(action.payload);
      state.data = action.payload;
    },
  },
});

export const { setCoupens } = coupenSlice.actions;
export default coupenSlice.reducer;
