import { find } from "lodash";
import { compile } from "path-to-regexp";
import { matchPath } from "react-router-dom";
import { RouteNames } from "@src/routeConfig";

type PathParamsType = {
  slug?: string;
  id?: string;
};

export type RoutesType = {
  isAuth?: boolean;
  notFound?: boolean;
  loader: Function;
  path: string;
  element: JSX.Element;
  name: RouteNames;
  exact: boolean;
}[];

type RouteType = RoutesType[number];

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
  name: RouteNames,
  routes: RoutesType,
  params: PathParamsType = {}
) => {
  const hasEmptySlug = params && params.hasOwnProperty("slug") && params.slug;
  const pathParams = hasEmptySlug ? { ...params, slug: "no-slug" } : params;
  return toPathByRouteName(name, routes)(pathParams);
};

type UrlMatch = {
  route: RouteType;
  params: Record<string, any>;
  path: string;
  pathname: string;
  exact?: boolean;
  search: string;
  hash: string;
  state?: Record<string, any>;
};
export const matchPathName = (
  location: any,
  routeConfiguration: RoutesType
) => {
  const { pathname, search, hash, state } = location;
  const matchedRoutes = routeConfiguration.reduce(
    (matches: UrlMatch[], route: RouteType) => {
      const refPath = { path: route.path, exact: route.exact ?? true };
      const match = matchPath(pathname, refPath);
      if (match) {
        matches.push({
          route,
          params: match.params,
          pathname: route.name,
          path: match.path,
          exact: route.exact,
          search,
          hash,
          state,
        });
      }
      return matches;
    },
    []
  );
  const matchedExactRoute = matchedRoutes.find((r) => {
    return r.exact === true || r.exact == null;
  });

  return matchedExactRoute ? [matchedExactRoute] : matchedRoutes;
};

export const canonicalRoutePath = (location: any, pathOnly = false) => {
  const { pathname, search, hash } = location;
  const cleanedPath = pathname.replace(/\/$/, "") || "/";
  return pathOnly ? cleanedPath : `${cleanedPath}${search}${hash}`;
};
