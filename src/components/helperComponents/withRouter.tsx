import React from "react";
import {
  Location,
  NavigateFunction,
  Params,
  PathMatch,
} from "react-router-dom";
import { routes } from "@src/util/routes";
import { useCustomRouter } from "@src/hooks";

export type RouterTypes = {
  matches: PathMatch[];
  location: Location;
  params: Readonly<Params>;
  navigate: NavigateFunction;
  history: History | undefined;
};

type WithRouterProps = { router: RouterTypes };

export function withRouter<T extends WithRouterProps = WithRouterProps>(
  WrappedComponent: React.ComponentType<T>
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  const WithRouterProps = (props: Omit<T, keyof WithRouterProps>) => {
    const router = useCustomRouter(routes);

    return <WrappedComponent {...(props as T)} router={router} />;
  };
  WithRouterProps.displayName = displayName;
  WithRouterProps.defaultProps = {} as Record<string, unknown>;
  WithRouterProps.propTypes = {} as Record<string, unknown>;
  return WithRouterProps;
}
