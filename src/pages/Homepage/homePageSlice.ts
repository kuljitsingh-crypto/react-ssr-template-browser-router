import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

export const homePageSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    incrementCountBy: (state, action: PayloadAction<number>) => {
      state.count += action.payload;
    },
    incrementCount: (state) => {
      state.count++;
    },
    decrementCount: (state) => {
      state.count--;
    },
  },
});

export const { incrementCount, incrementCountBy, decrementCount } =
  homePageSlice.actions;

export default homePageSlice.reducer;
