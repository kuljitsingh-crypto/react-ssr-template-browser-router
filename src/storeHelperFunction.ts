import {
  AsyncThunkOptions,
  AsyncThunkPayloadCreator,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { RootState } from "./store";
import { ConfigurationType } from "./custom-config";
import { HttpClient } from "./util/httpClient";

type AsyncThunkConfig = Parameters<typeof createAsyncThunk>;
type CustomAsyncThunkConfig = AsyncThunkConfig & {
  extra: {
    coreApi: HttpClient;
    extApi: HttpClient;
    config: ConfigurationType;
  };
  state: RootState;
};

/** Created this function to correctly type cast the extra arguments to coreApi and extApi  and getState to App Root State.
 * If you want to use coreApi and extApi passed in the extra arguments. Use this function for async operations.
 */
export const customCreateAsyncThunk = <
  Returned extends unknown = unknown,
  ThunkArg extends unknown = void
>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<
    Returned,
    ThunkArg,
    CustomAsyncThunkConfig
  >,
  options?: AsyncThunkOptions<ThunkArg, CustomAsyncThunkConfig>
) => createAsyncThunk<Returned, ThunkArg>(typePrefix, payloadCreator, options);
