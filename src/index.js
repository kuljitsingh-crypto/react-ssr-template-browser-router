import "core-js";
import React from "react";
import ReactDOMClient from "react-dom/client";
import { loadableReady } from "@loadable/component";

import "./index.css";
import { prepareRoutes } from "./util/routes";
import { ClientApp, renderApp } from "./App";
import { createStore } from "./store";
import { matchPathName } from "./util/routesHelperFunction";
import { Config, defaultConfig, mergeConfig } from "./custom-config";
import { fetchCurrentUser, setCurrentUser } from "./globalReducers/user.slice";
import { setAuthenticationState } from "./globalReducers/auth.slice";
import { deserialize } from "./util/serialization";
import { getFrmSessionStorage } from "./util/sessionStorage";
import { csrfToken } from "./util/csrfTokenHelper";

const onRecoverableError = (...args) => {
  // Error when hydration occur
};

if (typeof window !== "undefined") {
  const config = JSON.parse(window.__UI_CONFIGURATION__ || "{}");
  const rootPath = (config.rootPath || "") + "/";
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = rootPath;
}

function render(shouldHydrate, preloadedState, config) {
  const savedTheme = getFrmSessionStorage(
    defaultConfig.sessionStorageKeys.userTheme
  );
  const finalConfig = mergeConfig(defaultConfig, config);
  finalConfig.theme.name = savedTheme || finalConfig.theme.name;
  Config.updateConfig(finalConfig);
  const store = createStore(preloadedState, finalConfig);
  const isHydrated = shouldHydrate;
  const promises = [
    loadableReady(),
    store.dispatch(fetchCurrentUser()),
    csrfToken.setAsync(),
  ];
  Promise.all(promises).then(() => {
    if (shouldHydrate) {
      const key = Date.now() - Math.random();
      const rootElement = document.getElementById("root");
      ReactDOMClient.hydrateRoot(
        rootElement,
        // Using these to make sure make hydration content and client content differ
        // so that react throw  Minified React error to render correctly
        // If not handle like these then it will render content 3 times.
        // If you have better workaround, use that
        <div style={{ width: "100%", height: "100%" }} key={key} data-id={key}>
          <ClientApp
            store={store}
            isHydrated={isHydrated}
            config={finalConfig}
          />
        </div>,
        { onRecoverableError }
      );
    } else {
      const rootElement = document.getElementById("root");
      const root = ReactDOMClient.createRoot(rootElement);
      root.render(
        <ClientApp store={store} isHydrated={isHydrated} config={finalConfig} />
      );
    }
  });
}

if (typeof window !== "undefined") {
  const hasPreloadedState = !!window.__PRELOADED_STATE__;
  const preloadedState = deserialize(window.__PRELOADED_STATE__ || "{}");
  const configuration = deserialize(window.__UI_CONFIGURATION__ || "{}");

  require("./util/polyfills");
  render(hasPreloadedState, preloadedState, configuration);
}

export default renderApp;
export {
  prepareRoutes,
  createStore,
  matchPathName,
  mergeConfig,
  setCurrentUser,
  setAuthenticationState,
  defaultConfig,
};
