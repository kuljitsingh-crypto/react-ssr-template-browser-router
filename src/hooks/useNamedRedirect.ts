import { pathByRouteName } from "@src/util/routesHelperFunction";
import { useHistory } from "react-router-dom";
import { RouteNames } from "@src/routeConfig";
import { useRouteConfiguration } from "@src/context";

type NamedRedirectOptions = {
  replace?: boolean;
  state?: any;
  search?: string;
  hash?: string;
  params?: object;
};
export const useNamedRedirect = () => {
  const history = useHistory();
  const routes = useRouteConfiguration();
  const navigate = (name: RouteNames, options?: NamedRedirectOptions) => {
    const { replace, state, search, hash, params } = options || {};
    const pathname = pathByRouteName(name, routes, params);
    const searchParams =
      search && typeof search === "string" ? `?${search.replace("?", "")}` : "";
    const hashParams =
      hash && typeof hash === "string" ? `#${hash.replace("#", "")}` : "";
    const path = `${pathname}${searchParams}${hashParams}`;
    if (replace) {
      return history.replace(path, state || {});
    }
    return history.push(path, state || {});
  };
  return navigate;
};

export type NavigateFunc = ReturnType<typeof useNamedRedirect>;
