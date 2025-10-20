import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";

type CustomRouteProps = {
  renderProps: RouteComponentProps<{
    [x: string]: string | undefined;
  }>;
  route: any;
};

function CustomRoute(props: CustomRouteProps) {
  const { renderProps, route } = props;
  const { match, location } = renderProps;
  const { params } = match;
  const { loader, element } = route;
  useEffect(() => {
    if (typeof loader === "function") {
      loader({ params, search: location.search });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return element;
}

export function renderRoutes(route: any) {
  return (
    props: RouteComponentProps<{
      [x: string]: string | undefined;
    }>
  ) => {
    return <CustomRoute renderProps={props} route={route} />;
  };
}
