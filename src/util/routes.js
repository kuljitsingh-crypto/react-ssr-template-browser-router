import React from "react";
import loadable from "@loadable/component";
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

const pageDataLoadingAPI = {};

const dataLoaderWrapper = (loader) => {
  const isLoaderDefined = loader && typeof loader === "function";
  if (isLoaderDefined) {
    return (
        getState,
        dispatch,
        routeName,
        isAuthCheckReq,
        shouldWaitToResolve = false
      ) =>
      async (arg) => {
        const { params, search } = arg;
        const {
          auth: { isAuthenticated },
        } = getState();

        const shouldLoadData =
          typeof dispatch === "function" &&
          typeof getState === "function" &&
          (!isAuthCheckReq || isAuthenticated);

        if (shouldLoadData) {
          const searchObject = parseQueryString(search);
          // Add checker to your loader function (created using Redux Slice), so that it doesn't call loader again
          // when the data is already loaded from SSR.
          // Until you figure out way to remove this, Please add your checker.
          // Else it call loader again.
          // Check ProductsPageSlice.ts or ProductPageSlice.ts for more information.
          if (shouldWaitToResolve) {
            await loader({ getState, dispatch, params, search: searchObject });
          } else {
            loader({ getState, dispatch, params, search: searchObject });
          }
        }
        return null;
      };
  }
};

routeDetails.reduce((acc, route) => {
  pageDataLoadingAPI[route.name] = dataLoaderWrapper(route.loadData);
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
  if (details.loadData) {
    extraData.loader = details.loadData;
  }
  return {
    path: details.path,
    element: <Component />,
    name: details.name,
    exact: true,
    ...extraData,
  };
});

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
    const loader = pageDataLoadingAPI[restRoute.name];
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
