import React, { useEffect } from "react";
import ReactDOMServer from "react-dom/server";

import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { Provider } from "react-redux";
import { createRoutesForBrowserAndStaticRouter, routes } from "./util/routes";
import { StoreType, createStore } from "./store";
import { isEmpty } from "lodash";
import englishMessages from "./translations/en.json";
import frenchMessages from "./translations/fr.json";
import spanishMessages from "./translations/es.json";
import germenMessages from "./translations/de.json";
import { localeOptions } from "./util/localeHelper";
import moment from "moment";
import { ConfigurationType, defaultConfig, mergeConfig } from "./custom-config";
import {
  ConfigurationContextProvider,
  RouteConfigurationContextProvider,
} from "./context";
import { IntlProvider } from "react-intl";
import "./App.css";
import { changeTheme } from "./globalReducers/ui.slice";
import { RouterProvider, StaticRouterProvider } from "./components";

type ServerAppPropTypes = {
  routes: any;
  config: ConfigurationType;
  helmetContext: object;
  store: StoreType;
  isHydrated: boolean;
  context: Record<string, any>;
  location: string;
};

// If you want to add the language, imports  the wanted locale:
//   1) Create a translation messages file as "<language_code>.json" format under translations directory.
//   2) Import correct locale rules for Moment library
//   3) Use the `messagesInLocale` to add the correct translation messages in IntlProvider.
//   4) To support older browsers we need to  add the correct locale for intl-relativetimeformat to `util/polyfills.js`

// Note that there is also translations in './translations/countryCodes.js' file
// This file contains ISO 3166-1 alpha-2 country codes, country names and their translations in our default languages
// This will be used in collect billing address

// Step 2:
// If you are using a non-english locale with moment library,
// you should also import time specific formatting rules for that locale
// e.g. for French: import 'moment/locale/fr';

// Step 3:
// If you are using a non-english locale, point `messagesInLocale` to correct messages using localeOptions.<languageCode>
const messages = {
  [localeOptions.en]: englishMessages,
  [localeOptions.fr]: frenchMessages,
  [localeOptions.de]: germenMessages,
  [localeOptions.es]: spanishMessages,
};

const setLocaleForMoment = (
  locale: (typeof localeOptions)[keyof typeof localeOptions] = localeOptions.en
) => {
  // Set the Moment locale globally
  // See: http://momentjs.com/docs/#/i18n/changing-locale/
  moment.locale(locale);
};

type ClientAppPropsType = {
  store: StoreType;
  isHydrated: boolean;
  config: ConfigurationType;
};

const ClientApp = (props: ClientAppPropsType) => {
  const { store, config } = props;
  const locale = localeOptions.en;
  const messagesInLocale = messages[locale];
  setLocaleForMoment(locale);
  const modifiedRoutes = createRoutesForBrowserAndStaticRouter(
    store.dispatch,
    store.getState,
    routes
  );
  useEffect(() => {
    store.dispatch(changeTheme(config.theme.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.StrictMode>
      <RouteConfigurationContextProvider value={{ routes: modifiedRoutes }}>
        <ConfigurationContextProvider value={{ config: config }}>
          <IntlProvider
            locale={locale}
            messages={messagesInLocale}
            defaultLocale={localeOptions.en}>
            <Provider store={store}>
              <HelmetProvider>
                <RouterProvider routes={modifiedRoutes} />
              </HelmetProvider>
            </Provider>
          </IntlProvider>
        </ConfigurationContextProvider>
      </RouteConfigurationContextProvider>
    </React.StrictMode>
  );
};

const ServerApp = (props: ServerAppPropTypes) => {
  const { helmetContext, context, store, routes, config, location } = props;
  const locale = localeOptions.en;
  const messagesInLocale = messages[locale];
  setLocaleForMoment(locale);
  const modifiedRoutes = createRoutesForBrowserAndStaticRouter(
    store.dispatch,
    store.getState,
    routes,
    true,
    context
  );
  return (
    <React.StrictMode>
      <RouteConfigurationContextProvider value={{ routes: modifiedRoutes }}>
        <ConfigurationContextProvider value={{ config: config }}>
          <IntlProvider
            locale={locale}
            messages={messagesInLocale}
            defaultLocale={localeOptions.en}>
            <Provider store={store}>
              <HelmetProvider context={helmetContext}>
                <StaticRouterProvider
                  routes={modifiedRoutes}
                  location={location}
                  context={context}
                />
              </HelmetProvider>
            </Provider>
          </IntlProvider>
        </ConfigurationContextProvider>
      </RouteConfigurationContextProvider>
    </React.StrictMode>
  );
};

// This will be used to create element in server side
// If you want to use new data api then use it. make sure to change ssrUtills.js as well.
const renderApp = async (
  req: Request,
  routes: any,
  routerContext: Record<string, any>,
  collectWebChunk: any,
  preloadedStore: Record<string, unknown>,
  config: ConfigurationType
) => {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const finalConfig = mergeConfig(defaultConfig, config || {});
  if (!routerContext) return;
  const store = createStore(preloadedStore, finalConfig);
  const isHydrated = preloadedStore && !isEmpty(preloadedStore);
  // When rendering the app on server, we wrap the app with webExtractor.collectChunks
  // This is needed to figure out correct chunks/scripts to be included to server-rendered page.
  const withChunks = collectWebChunk(
    <ServerApp
      routes={routes}
      helmetContext={helmetContext}
      context={routerContext}
      isHydrated={isHydrated}
      store={store}
      config={finalConfig}
      location={req.url}
    />
  );
  const html = ReactDOMServer.renderToString(withChunks);
  const { helmet: head } = helmetContext;
  return { head, body: html };
};

export { ClientApp, renderApp };
