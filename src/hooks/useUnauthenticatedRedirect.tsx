import { useEffect } from "react";
import { useNamedRedirect } from "./useNamedRedirect";
import { useAppSelect } from "./useSelector";

export const useUnauthenticatedRedirect = () => {
  const { isAuthenticated } = useAppSelect({
    isAuthenticated: "auth.isAuthenticated",
  });
  const navigate = useNamedRedirect();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("LoginPage", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
};
