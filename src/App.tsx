import React, { useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  StaticHandlerContext,
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from "react-router-dom/server";
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
import { ConfigurationContextProvider } from "./context";
import { IntlProvider } from "react-intl";
import "./App.css";
import { changeTheme } from "./globalReducers/ui.slice";

type ServerAppPropTypes = {
  routes: ReturnType<typeof createStaticHandler>["dataRoutes"];
  context: StaticHandlerContext;
  config: ConfigurationType;
  helmetContext: object;
  store: StoreType;
  isHydrated: boolean;
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
  const rootpath = config.rootPath || "";
  const router = createBrowserRouter(modifiedRoutes, { basename: rootpath });

  useEffect(() => {
    store.dispatch(changeTheme(config.theme.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.StrictMode>
      <ConfigurationContextProvider value={{ config: config }}>
        <IntlProvider
          locale={locale}
          messages={messagesInLocale}
          defaultLocale={localeOptions.en}>
          <Provider store={store}>
            <HelmetProvider>
              <RouterProvider router={router} />
            </HelmetProvider>
          </Provider>
        </IntlProvider>
      </ConfigurationContextProvider>
    </React.StrictMode>
  );
};

const ServerApp = (props: ServerAppPropTypes) => {
  const { helmetContext, context, store, routes, config } = props;
  const locale = localeOptions.en;
  const messagesInLocale = messages[locale];
  setLocaleForMoment(locale);
  const modifiedRoutes = createRoutesForBrowserAndStaticRouter(
    store.dispatch,
    store.getState,
    routes
  );
  const router = createStaticRouter(modifiedRoutes, context);
  return (
    <React.StrictMode>
      <ConfigurationContextProvider value={{ config: config }}>
        <IntlProvider
          locale={locale}
          messages={messagesInLocale}
          defaultLocale={localeOptions.en}>
          <Provider store={store}>
            <HelmetProvider context={helmetContext}>
              <StaticRouterProvider
                router={router}
                context={context}
                nonce='the-nonce'
                hydrate={false}
              />
            </HelmetProvider>
          </Provider>
        </IntlProvider>
      </ConfigurationContextProvider>
    </React.StrictMode>
  );
};

type GetRouterContextType = (
  context: StaticHandlerContext | Response
) => StaticHandlerContext | null;

// This will be used to create element in server side
// If you want to use new data api then use it. make sure to change ssrUtills.js as well.
const renderApp = async (
  fetchRequest: Request,
  extractor: any,
  ChunkExtractorManager: React.ElementType,
  getRouterContext: GetRouterContextType,
  preloadedStore: Record<string, unknown>,
  config: ConfigurationType,
  baseName?: string
) => {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const handler = createStaticHandler(
    createRoutesForBrowserAndStaticRouter(undefined, undefined, routes, true),
    { basename: baseName }
  );
  const finalConfig = mergeConfig(defaultConfig, config);
  const context = await handler.query(fetchRequest);
  const routerContext = getRouterContext(context);
  if (!routerContext) return;
  const store = createStore(preloadedStore, finalConfig);
  const isHydrated = preloadedStore && !isEmpty(preloadedStore);

  // When rendering the app on server, we wrap the app with webExtractor.collectChunks
  // This is needed to figure out correct chunks/scripts to be included to server-rendered page.
  // https://loadable-components.com/docs/server-side-rendering/#3-setup-chunkextractor-server-side
  const withChunks = (
    <ChunkExtractorManager extractor={extractor}>
      <ServerApp
        routes={handler.dataRoutes}
        helmetContext={helmetContext}
        context={routerContext}
        isHydrated={isHydrated}
        store={store}
        config={finalConfig}
      />
    </ChunkExtractorManager>
  );

  const html = ReactDOMServer.renderToString(withChunks);

  const { helmet: head } = helmetContext;
  return { head, body: html };
};

export { ClientApp, renderApp };
