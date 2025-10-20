import React from "react";
import { Route, StaticRouter, Switch } from "react-router";
import { renderRoutes } from "./renderRoutes";

type Props = {
  routes: any[];
  location: string;
  context: Record<string, any>;
};
export default function RouterProvider(props: Props) {
  const { routes, location, context } = props;
  return (
    <StaticRouter location={location} context={context}>
      <Switch>
        {routes.map((route) => (
          <Route
            path={route.path}
            exact={route.exact}
            key={route.key}
            render={renderRoutes(route)}
          />
        ))}
      </Switch>
    </StaticRouter>
  );
}
