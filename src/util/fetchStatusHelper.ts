export const FETCH_STATUS = {
  idle: "idle",
  loading: "loading",
  succeeded: "succeeded",
  failed: "failed",
} as const;

export type InternalFetchStatusVal =
  (typeof FETCH_STATUS)[keyof typeof FETCH_STATUS];

export class FetchStatus {
  #status: InternalFetchStatusVal = FETCH_STATUS.idle;
  constructor(status?: InternalFetchStatusVal) {
    this.#status = status || FETCH_STATUS.idle;
  }
  set(status: InternalFetchStatusVal) {
    const instance = new FetchStatus(status);
    //@ts-ignore
    return instance;
  }
  get() {
    return this.#status;
  }
  get isLoading() {
    return this.#status === FETCH_STATUS.loading;
  }
  get isSucceeded() {
    return this.#status === FETCH_STATUS.succeeded;
  }
  get isFailed() {
    return this.#status === FETCH_STATUS.failed;
  }
  get isIdle() {
    return this.#status === FETCH_STATUS.idle;
  }
}

export type FetchStatusVal = FetchStatus;
export type FetchStatusValue = (typeof FETCH_STATUS)[keyof typeof FETCH_STATUS];
