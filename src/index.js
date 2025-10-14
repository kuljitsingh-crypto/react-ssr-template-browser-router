import "core-js";
import React from "react";
import ReactDOM from "react-dom/client";
import { loadableReady } from "@loadable/component";

import "./index.css";
import { routes } from "./util/routes";
import { ClientApp, renderApp } from "./App";
import { createStore } from "./store";
import { matchPathName } from "./util/routesHelperFunction";
import { Config, defaultConfig, mergeConfig } from "./custom-config";
import { fetchCurrentUser, setCurrentUser } from "./globalReducers/user.slice";
import { setAuthenticationState } from "./globalReducers/auth.slice";

if (typeof window !== "undefined") {
  const config = JSON.parse(window.__UI_CONFIGURATION__ || "{}");
  const rootPath = (config.rootPath || "") + "/";
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = rootPath;
}

function render(shouldHydrate, preloadedState, config) {
  const rootElement = document.getElementById("root");
  const finalConfig = mergeConfig(defaultConfig, config);
  Config.updateConfig(config);
  const store = createStore(preloadedState, finalConfig);
  const isHydrated = shouldHydrate;
  const promises = [loadableReady(), store.dispatch(fetchCurrentUser())];
  console.log("calling render", isHydrated);
  Promise.all(promises).then(() => {
    if (shouldHydrate) {
      const root = ReactDOM.hydrateRoot(
        rootElement,
        <React.StrictMode>
          <ClientApp
            store={store}
            isHydrated={isHydrated}
            config={finalConfig}
          />
        </React.StrictMode>,
        {
          onRecoverableError: console.error,
        }
      );
      console.log(root);
    } else {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <ClientApp
            store={store}
            isHydrated={isHydrated}
            config={finalConfig}
          />
        </React.StrictMode>
      );
    }
  });
}

if (typeof window !== "undefined") {
  const hasPreloadedState = !!window.__PRELOADED_STATE__;
  const preloadedState = JSON.parse(window.__PRELOADED_STATE__ || "{}");
  const configuration = JSON.parse(window.__UI_CONFIGURATION__ || "{}");

  require("./util/polyfills");
  render(hasPreloadedState, preloadedState, configuration);
}

console.log("here");
export default renderApp;
export {
  routes,
  createStore,
  matchPathName,
  setCurrentUser,
  setAuthenticationState,
};
