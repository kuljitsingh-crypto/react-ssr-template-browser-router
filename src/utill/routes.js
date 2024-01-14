import React from "react";
import loadable from "@loadable/component";
import { redirectLoader, routesName } from "./routesHelperFunction";
import { getPageDataLoadingAPI } from "../pages/pageDataLoadingAPI";

const HomePage = loadable(() =>
  import(/*webpackChunkName:"HomePage"*/ "../pages/Homepage/Homepage")
);
const AboutPage = loadable(() =>
  import(/*webpackChunkName:"AboutPage"*/ "../pages/About/About")
);
const ProductsPage = loadable(() =>
  import(
    /*webpackChunkName:"ProductsPage"*/ "../pages/ProductsPage/ProductsPage"
  )
);
const ProductPage = loadable(() =>
  import(/*webpackChunkName:"ProductPage"*/ "../pages/ProductPage/ProductPage")
);
const NoFoundPage = loadable(() =>
  import(/*webpackChunkName:"NoFoundPage"*/ "../pages/NoFoundPage/NoFoundPage")
);

const pageDataLoadingAPI = getPageDataLoadingAPI();

const dataLoaderWrapper =
  (loader) =>
  (dispatch, shouldWaitToResolve = false) =>
  async (arg) => {
    const { params, request } = arg;
    let search = "";
    if (request && request.url && typeof request.url === "string") {
      const url = new URL(request.url);
      search = url.search;
    }

    if (
      loader &&
      typeof loader === "function" &&
      typeof dispatch === "function"
    ) {
      // Add checker to your loader function (created using Redux Slice), so that it doesn't call loader again
      // when the data is already loaded from SSR.
      // Until you figure out way to remove this, Please add your checker.
      // Else again it call loader.
      // Check ProductsPageSlice.ts or ProductPageSlice.ts for more information.
      if (shouldWaitToResolve) {
        await loader(dispatch, params, search);
      } else {
        loader(dispatch, params, search);
      }
    }
    return null;
  };

const tempDataLoadingApi = {};
for (const key in pageDataLoadingAPI) {
  tempDataLoadingApi[key] = dataLoaderWrapper(pageDataLoadingAPI[key]);
}
Object.assign(pageDataLoadingAPI, tempDataLoadingApi);

export const routes = [
  {
    path: "/",
    element: <HomePage />,
    name: routesName.Homepage,
    exact: true,
  },
  {
    path: "/about",
    element: <AboutPage />,
    name: routesName.Aboutpage,
    exact: true,
  },
  {
    path: "/products",
    element: <ProductsPage />,
    name: routesName.ProductsPage,
    exact: true,
    loader: pageDataLoadingAPI.ProductsPage,
  },
  {
    path: "/products/:id",
    element: <ProductPage />,
    name: routesName.ProductPage,
    exact: true,
    loader: pageDataLoadingAPI.ProductPage,
  },
  // If you want to redirect to some other during routes initialization. Use redirectLoader,like below, instead of NamedRedirectComponent.
  {
    path: "/home",
    loader: redirectLoader(routesName.Homepage),
    element: null,
    name: routesName.Homepage,
    exact: true,
  },
  // Added notFound Key to tell server during SSR to send 404 status code.
  {
    path: "*",
    element: <NoFoundPage />,
    name: routesName.NotFoundPage,
    notFound: true,
    exact: true,
  },
];

/**
 * @param {UseDispatchType|undefined} dispatch
 * @param {Array} routes
 * @returns {Array}
 * */
export const createRoutesForBrowserAndStaticRouter = (
  dispatch,
  routes,
  shouldWaitToResolve = false
) => {
  const modifedRoutes = routes.map((route) => {
    if (
      route &&
      route.loader &&
      typeof route.loader === "function" &&
      route.element !== null
    ) {
      return {
        ...route,
        loader:
          typeof dispatch === "function"
            ? route.loader(dispatch, shouldWaitToResolve)
            : undefined,
      };
    }
    return { ...route };
  });
  return modifedRoutes;
};
