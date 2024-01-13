import { find } from "lodash";
import { compile } from "path-to-regexp";
import { Location, PathMatch, matchPath } from "react-router-dom";
import { routes } from "./routes";

export const routesName = {
  Root: "Root",
  Homepage: "Homepage",
  Aboutpage: "Aboutpage",
  ProductsPage: "ProductsPage",
  ProductPage: "ProductPage",
  NotFoundPage: "NotFoundPage",
} as const;

type PathParamsType = {
  slug?: string;
  id?: string;
};

type routesKey = keyof typeof routesName;

export type RoutesNameType = (typeof routesName)[routesKey];

export type RoutesType = typeof routes;

export type RouteType = {
  path: string;
  element: JSX.Element;
  name: RoutesNameType;
  loadData?: Function;
  exact: boolean;
};

const findRouteByName = (nameToFind: string, routes: RoutesType) =>
  find(routes, (route) => route.name === nameToFind);

const toPathByRouteName = (nameToFind: string, routes: RoutesType) => {
  const route = findRouteByName(nameToFind, routes);
  if (!route) {
    throw new Error(`Route ${nameToFind} not found.`);
  }
  return compile(route.path, { encode: encodeURIComponent });
};

export const pathByRouteName = (
  name: RoutesNameType,
  routes: RoutesType,
  params: PathParamsType = {}
) => {
  const hasEmptySlug = params && params.hasOwnProperty("slug") && params.slug;
  const pathParams = hasEmptySlug ? { ...params, slug: "no-slug" } : params;
  return toPathByRouteName(name, routes)(pathParams);
};

type matchType = Record<
  "params" | "pathname" | "route",
  PathMatch["pathname"] | PathMatch["params"] | RouteType
>;
export const matchPathName = (
  pathname: string,
  routeConfiguration: RoutesType
) => {
  const matchedPaths = routeConfiguration.reduce(
    (matches: matchType[], route: RouteType) => {
      const refPath = { path: route.path, end: true, caseSensitive: true };
      const match = matchPath(refPath, pathname);

      if (match && !match.params["*"]) {
        matches.push({
          route,
          params: match.params,
          pathname: match.pathname,
        });
      }
      return matches;
    },
    []
  );
  return matchedPaths;
};

export const canonicalRoutePath = (location: Location, pathOnly = false) => {
  const { pathname, search, hash } = location;
  const cleanedPath = pathname.replace(/\/$/, "") || "/";
  return pathOnly ? cleanedPath : `${cleanedPath}${search}${hash}`;
};
