import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootStateType } from "../../store";

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

export const selectCount = (state: RootStateType) => state.home.count;

export default homePageSlice.reducer;
