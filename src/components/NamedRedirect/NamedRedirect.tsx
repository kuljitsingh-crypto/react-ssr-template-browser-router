import React from "react";
import { Redirect } from "react-router-dom";
import { pathByRouteName } from "@src/util/routesHelperFunction";
import { routes } from "@src/util/routes";
import { bool, object, string } from "prop-types";
import { isBrowser } from "@src/util/browserHelperFunction";
import { RoutesNameType } from "@src/routeNames";

type NamedRedirectProps = {
  replace?: boolean;
  state?: any;
  name: RoutesNameType;
  search?: string;
  hash?: string;
  params?: object;
};

const defaultProps = {
  replace: false,
  search: "",
  hash: "",
  params: {},
};
function NamedRedirect(props: NamedRedirectProps) {
  const { replace, state, search, hash, name, params } = props || defaultProps;
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
  replace: bool.isRequired,
  search: string.isRequired,
  name: string.isRequired,
  state: object,
  hash: string.isRequired,
  params: object,
};

export default NamedRedirect;
