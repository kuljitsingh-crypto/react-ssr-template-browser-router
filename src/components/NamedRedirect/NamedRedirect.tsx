import React from "react";
import { Navigate, RelativeRoutingType } from "react-router-dom";
import { pathByRouteName } from "@src/util/routesHelperFunction";
import { routes } from "@src/util/routes";
import { bool, object, oneOf, string } from "prop-types";
import { isBrowser } from "@src/util/browserHelperFunction";
import { RoutesNameType } from "@src/routeNames";

type NamedRedirectProps = {
  replace?: boolean;
  state?: any;
  relative?: RelativeRoutingType;
  name: RoutesNameType;
  search?: string;
  hash?: string;
  params?: object;
};

function NamedRedirect(props: NamedRedirectProps) {
  const { replace, state, relative, search, hash, name, params } = props;
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

  // we are using this because Navigate doesn't support by react router v6 for SSR.
  if (!isBrowser()) {
    return null;
  }

  return (
    <Navigate
      replace={replace}
      state={state}
      relative={relative}
      to={{ pathname, search: searchParams, hash: hashParams }}
    />
  );
}

NamedRedirect.defaultProps = {
  replace: false,
  search: "",
  hash: "",
  relative: "route",
  params: {},
};

NamedRedirect.propTypes = {
  replace: bool.isRequired,
  search: string.isRequired,
  name: string.isRequired,
  relative: oneOf(["route", "path"]),
  state: object,
  hash: string.isRequired,
  params: object,
};

export default NamedRedirect;
