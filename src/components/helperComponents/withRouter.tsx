import React from "react";
import { useCustomRouter } from "@src/hooks";
import { useRouteConfiguration } from "@src/context";

export type RouterTypes = ReturnType<typeof useCustomRouter>;

export type WithRouter = { router: RouterTypes };

export function withRouter<T extends WithRouter = any>(
  WrappedComponent: React.ComponentType<T>
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  const WithRouterProps = (props: Omit<T, keyof WithRouter>) => {
    const routes = useRouteConfiguration();
    const router = useCustomRouter(routes);

    return <WrappedComponent {...(props as T)} router={router} />;
  };
  WithRouterProps.displayName = displayName;
  WithRouterProps.propTypes = {} as Record<string, unknown>;
  return WithRouterProps;
}
