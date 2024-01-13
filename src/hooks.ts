import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { AppDispatch, RootStateType } from "./store";
import { useSelector } from "react-redux";
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { RoutesType, matchPathName } from "./utill/routesHelperFunction";

type AppDispatchFuncType = () => AppDispatch;

//----------------------redux hooks --------------------------------
export const useAppDispatch: AppDispatchFuncType = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;
export type UseSelectorType = typeof useAppSelector;
export type UseDispatchType = ReturnType<typeof useAppDispatch>;

//---------------------location helper hooks -------------------------
export const useCustomRouterDetails = (routes: RoutesType) => {
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
