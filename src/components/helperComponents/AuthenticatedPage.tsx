import React from "react";
import NamedRedirect from "../NamedRedirect/NamedRedirect";

import { pathByRouteName } from "@src/util/routesHelperFunction";
import { useRouteConfiguration } from "@src/context";
import { useAppSelect } from "@src/hooks";
import { WithRouter, withRouter } from "./withRouter";

type AuthenticatedPageState = WithRouter & {
  children: React.JSX.Element;
  name: string;
  staticContext?: Record<string, any>;
};

function AuthenticatedPage(props: AuthenticatedPageState) {
  const { children, name, staticContext, router } = props;
  const { isAuthenticated } = useAppSelect({
    isAuthenticated: "auth.isAuthenticated",
  });
  const routes = useRouteConfiguration();
  const { matches } = router;
  const firstMatch = matches[0];
  const fromMayBe = firstMatch
    ? {
        from: {
          name: firstMatch.pathname,
          params: firstMatch.params,
          search: firstMatch.search,
          hash: firstMatch.hash,
        },
      }
    : {};
  if (!isAuthenticated) {
    const path = pathByRouteName("LoginPage", routes);
    if (staticContext) {
      staticContext.url = path;
      staticContext.unauthorized = true;
      Object.assign(staticContext, fromMayBe);
    }
    return <NamedRedirect name='LoginPage' replace={true} state={fromMayBe} />;
  }
  return (
    <React.Fragment>{React.cloneElement(children, { name })}</React.Fragment>
  );
}

export default withRouter(AuthenticatedPage);
