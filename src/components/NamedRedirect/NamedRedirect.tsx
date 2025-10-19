import React from "react";
import { Redirect } from "react-router-dom";
import { pathByRouteName } from "@src/util/routesHelperFunction";
import { bool, object, string } from "prop-types";
import { isBrowser } from "@src/util/browserHelperFunction";
import { RouteNames } from "@src/routeConfig";
import { useRouteConfiguration } from "@src/context";

type NamedRedirectProps = {
  replace?: boolean;
  state?: any;
  name: RouteNames;
  search?: string;
  hash?: string;
  params?: object;
};

const defaultProps = {
  search: "",
  hash: "",
  params: {},
};
function NamedRedirect(props: NamedRedirectProps) {
  const {
    state,
    search,
    hash,
    name,
    params,
    replace = false,
  } = props || defaultProps;
  const routes = useRouteConfiguration();
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
    <Redirect
      push={!replace}
      to={{ pathname, search: searchParams, hash: hashParams, state }}
    />
  );
}

NamedRedirect.propTypes = {
  search: string,
  name: string.isRequired,
  state: object,
  hash: string,
  params: object,
  replace: bool,
};

export default NamedRedirect;
