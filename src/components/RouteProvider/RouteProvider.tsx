import React, { useEffect, useState } from "react";
import { routes } from "../../utill/routes";
import { Location, Params, Route, Routes } from "react-router-dom";
import { RouterTypes, withRouter } from "../helperComponents/withRouter";
import { RouteType, matchPathName } from "../../utill/routesHelperFunction";
import { UseDispatchType } from "../../hooks";
import { unwrapResult } from "@reduxjs/toolkit";
import { RootStateType } from "../../store";
import NoFoundPage from "../../pages/NoFoundPage/NoFoundPage";

type RoutesType = {
  routeConfiguration: typeof routes;
  router: RouterTypes;
  dispatch: UseDispatchType;
  getState: () => RootStateType;
  isHydrated: boolean;
};

function RouterProviderComponent(props: RoutesType) {
  const { routeConfiguration, router, dispatch, isHydrated } = props;
  const { location } = router;
  const [shouldLoadData, setShouldLoadData] = useState(!isHydrated);

  const checkAndCallLoadData = (
    route: RouteType,
    params: Record<string, unknown>,
    location: Location,
    dispatch: UseDispatchType
  ) => {
    if (route && typeof route.loadData === "function") {
      route
        .loadData(dispatch, params, location.search)
        .then(unwrapResult)
        .catch((err: unknown) => {
          // console.log("failed to load data:", err);
        });
    }
  };

  useEffect(() => {
    setShouldLoadData(true);
  }, []);

  useEffect(() => {
    if (location && location.pathname && shouldLoadData) {
      const [matchedRoute] = matchPathName(location.pathname, routes);
      if (matchedRoute) {
        checkAndCallLoadData(
          matchedRoute.route as RouteType,
          matchedRoute.params as Params,
          location,
          dispatch
        );
      }
    }
  }, [location, dispatch]);

  return (
    <Routes>
      {routeConfiguration.map((route) => {
        return (
          <Route
            key={route.name}
            id={route.name}
            path={route.path}
            element={route.element}
            caseSensitive={route.exact}
          />
        );
      })}
      <Route path='*' element={<NoFoundPage />} />
    </Routes>
  );
}
const RouterProvider = withRouter(RouterProviderComponent);

export default RouterProvider;
