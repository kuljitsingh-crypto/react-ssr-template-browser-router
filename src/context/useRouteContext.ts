import { RoutesType } from "@src/util/routesHelperFunction";
import React, { useContext } from "react";

const RouteConfigurationContext = React.createContext<{ routes: RoutesType }>(
  {} as any
);

export const useRouteConfiguration = () => {
  const context = useContext(RouteConfigurationContext);
  return context.routes;
};

export const RouteConfigurationContextProvider =
  RouteConfigurationContext.Provider;
