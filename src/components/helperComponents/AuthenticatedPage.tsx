import React from "react";
import NamedRedirect from "../NamedRedirect/NamedRedirect";

import { pathByRouteName } from "@src/util/routesHelperFunction";
import { useRouteConfiguration } from "@src/context";
import { useSelector } from "@src/hooks/useSelector";

type AuthenticatedPageState = {
  children: React.JSX.Element;
  name: string;
  staticContext?: Record<string, any>;
};

function AuthenticatedPage(props: AuthenticatedPageState) {
  const { children, name, staticContext } = props;
  const { isAuthenticated } = useSelector({
    isAuthenticated: "auth.isAuthenticated",
  });
  const routes = useRouteConfiguration();
  if (!isAuthenticated) {
    const path = pathByRouteName("LoginPage", routes);
    if (staticContext) {
      staticContext.url = path;
      staticContext.unauthorized = true;
    }
    return <NamedRedirect name='LoginPage' replace={true} />;
  }

  return (
    <React.Fragment>{React.cloneElement(children, { name })}</React.Fragment>
  );
}

export default AuthenticatedPage;
