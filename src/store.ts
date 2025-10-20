import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "./reducers";
import axiosInstance from "axios";
import { defaultConfig } from "./custom-config";

const axios = axiosInstance.create();
const axiosWithCred = axiosInstance.create();
axiosWithCred.defaults.withCredentials = true;
export const createStore = (preloadedState = {}, config = defaultConfig) =>
  configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { axios, config, axiosWithCred },
        },
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV !== "production",
    preloadedState,
  });

export type Store = ReturnType<typeof createStore>;
export type RootState = ReturnType<Store["getState"]>;
export type Dispatch = Store["dispatch"];
