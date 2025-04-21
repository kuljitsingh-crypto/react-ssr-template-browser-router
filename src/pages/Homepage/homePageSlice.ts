import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "@src/globalReducers/user.slice";
import { UseDispatchType, UseGetStateType } from "@src/hooks";
import type { RootStateType } from "@src/store";
import { Params } from "react-router-dom";

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

export const loadData = (
  getState: UseGetStateType,
  dispatch: UseDispatchType,
  params: Params,
  search?: string
) => {
  return dispatch(fetchCurrentUser());
};
