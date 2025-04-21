import { FetchStatusVal } from "@src/custom-config";
import { GeneralError } from "@src/util/APITypes";
import { useCallback, useEffect } from "react";

type SuccessArgCallback = (params?: any) => void | Promise<void>;
type ErrorArgCallback = (
  err: GeneralError | null,
  params?: any
) => void | Promise<void>;

type Handler = {
  [k in FetchStatusVal]?: {
    handler: k extends "failed" ? ErrorArgCallback : SuccessArgCallback;
    params?: any;
  };
};
export const useFetchStatusHandler = (params: {
  fetchStatus: FetchStatusVal;
  fetchError: GeneralError | null;
  callback: Handler;
}) => {
  const { fetchStatus, fetchError, callback } = params;

  const handlerCb = useCallback(() => {
    const { handler, params } = callback[fetchStatus] || {};
    if (typeof handler !== "function") {
      return;
    }
    if (fetchStatus === "failed") {
      handler(fetchError, params);
    } else {
      (handler as SuccessArgCallback)(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchStatus, fetchError]);

  useEffect(() => {
    handlerCb();
  }, [fetchStatus, handlerCb]);
};
