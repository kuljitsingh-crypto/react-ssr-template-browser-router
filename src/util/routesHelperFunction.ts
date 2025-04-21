import { find } from "lodash";
import { compile } from "path-to-regexp";
import {
  ActionFunction,
  LazyRouteFunction,
  Location,
  PathMatch,
  RouteObject,
  ShouldRevalidateFunction,
  matchPath,
  redirect,
} from "react-router-dom";
import { routes } from "./routes";
import { RoutesNameType } from "@src/routeNames";

type PathParamsType = {
  slug?: string;
  id?: string;
};

export type RoutesType = typeof routes;

type RouteType = {
  path: string;
  element: JSX.Element | null;
  name: RoutesNameType;
  loadData?: Function;
  exact: boolean;
  index?: boolean;
  children?: React.ReactNode;
  caseSensitive?: boolean;
  id?: string;
  loader?: Function;
  action?: ActionFunction;
  hydrateFallbackElement?: React.ReactNode | null;
  errorElement?: React.ReactNode | null;
  Component?: React.ComponentType | null;
  HydrateFallback?: React.ComponentType | null;
  ErrorBoundary?: React.ComponentType | null;
  handle?: RouteObject["handle"];
  shouldRevalidate?: ShouldRevalidateFunction;
  lazy?: LazyRouteFunction<RouteObject>;
  isAuth?: boolean;
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

export const namedRedirect = (
  name: RoutesNameType,
  routes: RoutesType,
  params: Record<string, unknown> = {},
  search?: string,
  hash?: string
) => {
  const pathname = pathByRouteName(name, routes, params);
  const searchParams =
    search && typeof search === "string"
      ? search.startsWith("?")
        ? search
        : `?${search}`
      : "";

  const hashParams =
    hash && typeof hash === "string"
      ? hash.startsWith("#")
        ? hash
        : `#${hash}`
      : "";
  const redirectUrl = `${pathname}${searchParams}${hashParams}`;
  return redirect(redirectUrl);
};

export const redirectLoader = (
  name: RoutesNameType,
  params: Record<string, unknown> = {},
  search?: string,
  hash?: string
) => {
  return async () => namedRedirect(name, routes, params, search, hash);
};
