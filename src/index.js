import "core-js";
import React from "react";
import ReactDOM from "react-dom";
import { loadableReady } from "@loadable/component";

import { routes } from "./utill/routes";
import { ClientApp, renderApp } from "./App";
import { createStore } from "./store";
import { matchPathName } from "./utill/routesHelperFunction";
import "./index.css";

function render(shouldHydrate, preloadedState) {
  const rootElement = document.getElementById("root");
  const store = createStore(preloadedState);
  const isHydrated = shouldHydrate;
  loadableReady().then(() => {
    if (shouldHydrate) {
      ReactDOM.hydrate(
        <ClientApp store={store} isHydrated={isHydrated} />,
        rootElement
      );
    } else {
      ReactDOM.render(
        <ClientApp store={store} isHydrated={isHydrated} />,
        rootElement
      );
    }
  });
}

if (typeof window !== "undefined") {
  const hasPreloadedState = !!window.__PRELOADED_STATE__;
  const preloadedState = JSON.parse(window.__PRELOADED_STATE__ || "{}");

  require("./utill/polyfills");
  render(hasPreloadedState, preloadedState);
}

export default renderApp;
export { routes, createStore, matchPathName };
