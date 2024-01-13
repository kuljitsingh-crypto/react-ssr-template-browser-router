import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "./reducers";
import axios from "axios";

export const createStore = (preloadedState = {}) =>
  configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: axios,
        },
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV !== "production",
    preloadedState,
  });

export type StoreType = ReturnType<typeof createStore>;
export type RootStateType = ReturnType<StoreType["getState"]>;
export type AppDispatch = StoreType["dispatch"];
