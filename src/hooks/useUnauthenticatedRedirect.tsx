import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNamedRedirect } from "./useNamedRedirect";
import { selectStateValue } from "@src/storeHelperFunction";

export const useUnauthenticatedRedirect = () => {
  const isAuthenticated = useSelector(
    selectStateValue("auth", "isAuthenticated")
  );
  const navigate = useNamedRedirect();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("LoginPage", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
};
