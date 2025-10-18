import { useLocation, useHistory, useParams } from "react-router-dom";
import { RoutesType, matchPathName } from "@src/util/routesHelperFunction";
import { useNamedRedirect } from "./useNamedRedirect";

//---------------------location helper hooks -------------------------
export const useCustomRouter = (routes: RoutesType) => {
  const location = useLocation();
  const history = useHistory();
  const params = useParams();
  const matches =
    location && location.pathname
      ? matchPathName(location.pathname, routes)
      : [];
  const navigate = useNamedRedirect();
  return { location, params, history, matches, navigate };
};
