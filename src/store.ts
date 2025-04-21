import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "./reducers";
import axios from "axios";
import axiosWithCredentials from "axios";
import { defaultConfig } from "./custom-config";

axiosWithCredentials.defaults.withCredentials = true;
export const createStore = (preloadedState = {}, config = defaultConfig) =>
  configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { axios, config, axiosWithCredentials },
        },
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV !== "production",
    preloadedState,
  });

export type StoreType = ReturnType<typeof createStore>;
export type RootStateType = ReturnType<StoreType["getState"]>;
export type AppDispatch = StoreType["dispatch"];
