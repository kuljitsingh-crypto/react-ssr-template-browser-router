import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { RoutesType, matchPathName } from "@src/util/routesHelperFunction";

//---------------------location helper hooks -------------------------
export const useCustomRouter = (routes: RoutesType) => {
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const params = useParams();
  const history = typeof window !== "undefined" ? window.history : undefined;
  const matches =
    location && location.pathname
      ? matchPathName(location.pathname, routes)
      : [];

  return { location, params, history, matches, navigate };
};
