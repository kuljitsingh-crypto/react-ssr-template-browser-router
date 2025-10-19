import React from "react";
import { Link } from "react-router-dom";
import { pathByRouteName } from "@src/util/routesHelperFunction";
import { array, bool, func, object, shape, string } from "prop-types";
import { RouterTypes, withRouter } from "../helperComponents/withRouter";
import classNames from "classnames";
import css from "./NamedLink.module.css";
import { RouteNames } from "@src/routeConfig";
import { useRouteConfiguration } from "@src/context";

const defaultProps = {
  to: {},
  replace: false,
  state: {},
  routeParams: {},
  className: null,
  activeClassName: null,
};

export type NamedLinkPropsTypes = {
  name: RouteNames;
  routeParams?: object;
  to?: { search: string; hash: string };
  state?: any;
  replace?: boolean;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  router: RouterTypes;
};

const NamedLinkComponent = (props: NamedLinkPropsTypes) => {
  const {
    name,
    routeParams,
    to,
    children,
    router,
    className,
    activeClassName,
  } = props || defaultProps;
  const routeList = useRouteConfiguration();
  const pathname = pathByRouteName(name, routeList, routeParams);
  const linksProps = {
    to: {
      ...to,
      pathname,
    },
  };

  const active =
    router &&
    router.matches &&
    router.matches.length >= 1 &&
    router.matches[0].pathname === pathname
      ? true
      : false;
  const activeClasNameMaybe = activeClassName
    ? {
        [activeClassName]: active,
      }
    : {};

  const classes = classNames(css.root, className, activeClasNameMaybe);
  return (
    <Link {...linksProps} className={classes}>
      {children}
    </Link>
  );
};

const NamedLink = withRouter(NamedLinkComponent);

NamedLink.propTypes = {
  name: string,
  routeParams: object,
  replace: bool,
  state: object,
  className: string,
  to: shape({ search: string, hash: string }),
  activeClassName: string,
  router: shape({
    matches: array.isRequired,
    location: object.isRequired,
    params: object.isRequired,
    history: object.isRequired,
    navigate: func.isRequired,
  }),
};
export default NamedLink;
