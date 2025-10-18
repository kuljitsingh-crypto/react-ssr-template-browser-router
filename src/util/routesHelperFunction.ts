import { find } from "lodash";
import { compile } from "path-to-regexp";
import { matchPath } from "react-router-dom";
import { routes } from "./routes";
import { RoutesNameType } from "@src/routeNames";

type PathParamsType = {
  slug?: string;
  id?: string;
};

export type RoutesType = typeof routes;

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
  name: RoutesNameType,
  routes: RoutesType,
  params: PathParamsType = {}
) => {
  const hasEmptySlug = params && params.hasOwnProperty("slug") && params.slug;
  const pathParams = hasEmptySlug ? { ...params, slug: "no-slug" } : params;
  return toPathByRouteName(name, routes)(pathParams);
};

type matchType = {
  route: RouteType;
  params: Record<string, any>;
  path: string;
  pathname: string;
};
export const matchPathName = (
  pathname: string,
  routeConfiguration: RoutesType
) => {
  const matchedPaths = routeConfiguration.reduce(
    (matches: matchType[], route: RouteType) => {
      const refPath = { path: route.path, exact: route.exact ?? true };
      const match = matchPath(pathname, refPath);
      if (match) {
        matches.push({
          route,
          params: match.params,
          pathname: route.name,
          path: match.path,
        });
      }
      return matches;
    },
    []
  );
  return matchedPaths;
};

export const canonicalRoutePath = (location: any, pathOnly = false) => {
  const { pathname, search, hash } = location;
  const cleanedPath = pathname.replace(/\/$/, "") || "/";
  return pathOnly ? cleanedPath : `${cleanedPath}${search}${hash}`;
};

// export const namedRedirect = (
//   name: RoutesNameType,
//   routes: RoutesType,
//   params: Record<string, unknown> = {},
//   search?: string,
//   hash?: string
// ) => {
//   const pathname = pathByRouteName(name, routes, params);
//   const searchParams =
//     search && typeof search === "string"
//       ? search.startsWith("?")
//         ? search
//         : `?${search}`
//       : "";

//   const hashParams =
//     hash && typeof hash === "string"
//       ? hash.startsWith("#")
//         ? hash
//         : `#${hash}`
//       : "";
//   const redirectUrl = `${pathname}${searchParams}${hashParams}`;
//   return
// };

// export const redirectLoader = (
//   name: RoutesNameType,
//   params: Record<string, unknown> = {},
//   search?: string,
//   hash?: string
// ) => {
//   return  () => namedRedirect(name, routes, params, search, hash);
// };
