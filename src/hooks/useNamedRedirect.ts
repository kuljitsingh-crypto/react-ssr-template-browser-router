import React from "react";
import {
  pathByRouteName,
  RoutesNameType,
} from "@src/util/routesHelperFunction";
import { RelativeRoutingType, useNavigate } from "react-router-dom";
import { routes } from "@src/util/routes";

type NamedRedirectOptions = {
  replace?: boolean;
  state?: any;
  relative?: RelativeRoutingType;
  search?: string;
  hash?: string;
  params?: object;
  preventScrollReset?: boolean;
};
export const useNamedRedirect = () => {
  const routerNavigate = useNavigate();
  const navigate = (name: RoutesNameType, options?: NamedRedirectOptions) => {
    const {
      replace,
      state,
      relative,
      search,
      hash,
      params,
      preventScrollReset,
    } = options || {};
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
    routerNavigate(
      { pathname, search: searchParams, hash: hashParams },
      {
        replace,
        state,
        relative,
        preventScrollReset,
      }
    );
  };
  return navigate;
};
