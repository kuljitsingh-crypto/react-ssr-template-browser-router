import { BrowserRouter, Route, Switch } from "react-router-dom";
import { renderRoutes } from "./renderRoutes";

type Props = {
  routes: any[];
};

export default function RouterProvider(props: Props) {
  const { routes } = props;
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
