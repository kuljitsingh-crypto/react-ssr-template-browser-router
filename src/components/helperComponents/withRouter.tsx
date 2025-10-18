import React from "react";
import { routes } from "@src/util/routes";
import { useCustomRouter } from "@src/hooks";

export type RouterTypes = {
  matches: any[];
  location: Location;
  params: Readonly<Record<string, any>>;
  navigate: Function;
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
  WithRouterProps.propTypes = {} as Record<string, unknown>;
  return WithRouterProps;
}
