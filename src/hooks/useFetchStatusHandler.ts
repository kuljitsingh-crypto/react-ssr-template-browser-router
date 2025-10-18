import { GeneralError } from "@src/util/APITypes";
import { FetchStatusVal, FetchStatusValue } from "@src/util/fetchStatusHelper";
import { useCallback, useEffect } from "react";

type SuccessArgCallback = (status: FetchStatusVal) => void | Promise<void>;
type ErrorArgCallback = (err: GeneralError | null) => void | Promise<void>;

type Handler = Partial<{
  [k in FetchStatusValue]: k extends "failed"
    ? ErrorArgCallback
    : SuccessArgCallback;
}>;

export const useFetchStatusHandler = (
  params: {
    fetchStatus: FetchStatusVal;
    fetchError: GeneralError | null;
  } & Handler
) => {
  const { fetchStatus, fetchError, ...handlers } = params;

  const handlerCb = useCallback(() => {
    const status = fetchStatus.get();
    const handler = handlers[status] || null;
    if (typeof handler !== "function") {
      return;
    }
    if (fetchStatus.isFailed) {
      (handler as ErrorArgCallback)(fetchError);
    } else {
      (handler as SuccessArgCallback)(fetchStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchStatus, fetchError]);

  useEffect(() => {
    handlerCb();
  }, [fetchStatus, handlerCb]);
};
