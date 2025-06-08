import React from "react";
import loadable from "@loadable/component";
import { getPageDataLoadingAPI } from "@src/pages/pageDataLoadingAPI";
import AuthenticatedPage from "@src/components/helperComponents/AuthenticatedPage";
import { parseQueryString } from "./functionHelper";
import { routeDetails } from "@src/routeNames";

const loadableComponent = routeDetails.reduce((acc, details) => {
  const name = details.name;
  acc[name] = loadable(() =>
    import(/*webpackChunkName: "[request]" */ `../pages/${name}/${name}`)
  );
  return acc;
}, {});

// const HomePage = loadable(() =>
//   import(/*webpackChunkName:"HomePage"*/ "../pages/Homepage/Homepage")
// );

// const ProductsPage = loadable(() =>
//   import(
//     /*webpackChunkName:"ProductsPage"*/ "../pages/ProductsPage/ProductsPage"
//   )
// );
// const ProductPage = loadable(() =>
//   import(/*webpackChunkName:"ProductPage"*/ "../pages/ProductPage/ProductPage")
// );

// const LoginPage = loadable(() =>
//   import(/*webpackChunkName:"LoginPage"*/ "../pages/LoginPage/LoginPage")
// );
// const NoFoundPage = loadable(() =>
//   import(
//     /*webpackChunkName:"NotFoundPage"*/ "../pages/NotFoundPage/NotFoundPage"
//   )
// );

const pageDataLoadingAPI = getPageDataLoadingAPI();

const dataLoaderWrapper =
  (loader) =>
  (
    getState,
    dispatch,
    routeName,
    isAuthCheckReq,
    shouldWaitToResolve = false
  ) =>
  async (arg) => {
    const { params, request } = arg;
    let search = "";
    if (request && request.url && typeof request.url === "string") {
      const url = new URL(request.url);
      search = url.search;
    }
    const {
      auth: { isAuthenticated },
    } = getState();

    const shouldLoadData =
      loader &&
      typeof loader === "function" &&
      typeof dispatch === "function" &&
      typeof getState === "function" &&
      (!isAuthCheckReq || isAuthenticated);

    if (shouldLoadData) {
      const searchObject = parseQueryString(search);
      // Add checker to your loader function (created using Redux Slice), so that it doesn't call loader again
      // when the data is already loaded from SSR.
      // Until you figure out way to remove this, Please add your checker.
      // Else again it call loader.
      // Check ProductsPageSlice.ts or ProductPageSlice.ts for more information.
      if (shouldWaitToResolve) {
        await loader(getState, dispatch, params, searchObject);
      } else {
        loader(getState, dispatch, params, searchObject);
      }
    }
    return null;
  };

Object.keys(pageDataLoadingAPI).reduce((acc, key) => {
  pageDataLoadingAPI[key] = dataLoaderWrapper(pageDataLoadingAPI[key]);
  return acc;
}, pageDataLoadingAPI);

export const routes = routeDetails.map((details) => {
  const Component = loadableComponent[details.name];
  const extraData = {};
  if (details.isAuth) {
    extraData.isAuth = details.isAuth;
  } else if (details.notFound) {
    extraData.notFound = details.notFound;
  }

  return {
    path: details.path,
    element: <Component />,
    name: details.name,
    exact: true,
    ...extraData,
  };
});

// export const routes = [
//   {
//     path: "/",
//     element: <HomePage />,
//     name: routesName.Homepage,
//     exact: true,
//     isAuth: true,
//   },
//   {
//     path: "/products",
//     element: <ProductsPage />,
//     name: routesName.ProductsPage,
//     exact: true,
//     isAuth: true,
//   },
//   {
//     path: "/products/:id",
//     element: <ProductPage />,
//     name: routesName.ProductPage,
//     exact: true,
//     isAuth: true,
//   },
//   {
//     path: "/login",
//     element: <LoginPage />,
//     name: routesName.LoginPage,
//     exact: true,
//   },
//   // If you want to redirect to some other during routes initialization. Use redirectLoader,like below, instead of NamedRedirectComponent.
//   {
//     path: "/home",
//     loader: redirectLoader(routesName.Homepage),
//     element: null,
//     name: routesName.Homepage,
//     exact: true,
//   },
//   // Added notFound Key to tell server during SSR to send 404 status code.
//   {
//     path: "*",
//     element: <NoFoundPage />,
//     name: routesName.NotFoundPage,
//     notFound: true,
//     exact: true,
//   },
// ];
// console.log(routes);

/**
 * @param {UseDispatchType|undefined} dispatch
 * @param {Array} routes
 * @returns {Array}
 * */
export const createRoutesForBrowserAndStaticRouter = (
  dispatch,
  getState,
  routes,
  shouldWaitToResolve = false
) => {
  const modified = routes.map((route) => {
    const { isAuth, ...restRoute } = route;

    if (isAuth) {
      restRoute.element = React.createElement(AuthenticatedPage, {
        children: restRoute.element,
        name: restRoute.name,
      });
    } else if (restRoute.element !== null) {
      restRoute.element = React.cloneElement(restRoute.element, {
        name: restRoute.name,
      });
    }
    if (restRoute.element === null) {
      return { ...restRoute, key: restRoute.name };
    }
    const loader = pageDataLoadingAPI[restRoute.name] || restRoute.loader;
    const loaderMaybe =
      loader && typeof loader === "function"
        ? {
            loader:
              typeof dispatch === "function"
                ? loader(
                    getState,
                    dispatch,
                    restRoute.name,
                    isAuth,
                    shouldWaitToResolve
                  )
                : undefined,
          }
        : {};
    return {
      ...restRoute,
      ...loaderMaybe,
      key: restRoute.name,
    };
  });
  return modified;
};
