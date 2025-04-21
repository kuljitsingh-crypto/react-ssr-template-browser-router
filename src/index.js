import "core-js";
import React from "react";
import ReactDOM from "react-dom";
import { loadableReady } from "@loadable/component";

import { routes } from "./util/routes";
import { ClientApp, renderApp } from "./App";
import { createStore } from "./store";
import { matchPathName } from "./util/routesHelperFunction";
import "./index.css";
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

  Promise.all(promises).then(() => {
    if (shouldHydrate) {
      ReactDOM.hydrate(
        <ClientApp
          store={store}
          isHydrated={isHydrated}
          config={finalConfig}
        />,
        rootElement
      );
    } else {
      ReactDOM.render(
        <ClientApp
          store={store}
          isHydrated={isHydrated}
          config={finalConfig}
        />,
        rootElement
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

export default renderApp;
export {
  routes,
  createStore,
  matchPathName,
  setCurrentUser,
  setAuthenticationState,
};
