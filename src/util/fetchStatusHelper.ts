const FETCH_STATUS = {
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

  static #create(status: InternalFetchStatusVal) {
    const instance = new FetchStatus(status);
    //@ts-ignore
    return instance;
  }

  static get idle() {
    return FetchStatus.#create(FETCH_STATUS.idle);
  }

  static get loading() {
    return FetchStatus.#create(FETCH_STATUS.loading);
  }

  static get succeeded() {
    return FetchStatus.#create(FETCH_STATUS.succeeded);
  }

  static get failed() {
    return FetchStatus.#create(FETCH_STATUS.failed);
  }

  get status() {
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

  toString() {
    return this.#status;
  }

  valueOf() {
    return this.#status;
  }
}

export type FetchStatusVal = FetchStatus;
export type FetchStatusValue = (typeof FETCH_STATUS)[keyof typeof FETCH_STATUS];
