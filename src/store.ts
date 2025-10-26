import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "./reducers";

import { defaultConfig } from "./custom-config";
import { HttpClient } from "./util/httpClient";
import { apiBaseUrl } from "./util/api";

export const createStore = (preloadedState = {}, config = defaultConfig) => {
  const baseUrl = apiBaseUrl(config);
  const coreApi = new HttpClient(baseUrl);
  const extApi = new HttpClient();

  return configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { coreApi, extApi, config },
        },
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV !== "production",
    preloadedState,
  });
};

export type Store = ReturnType<typeof createStore>;
export type RootState = ReturnType<Store["getState"]>;
export type Dispatch = Store["dispatch"];
