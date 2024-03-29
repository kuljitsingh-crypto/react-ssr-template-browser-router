import { AsyncThunkConfig } from "@reduxjs/toolkit/dist/createAsyncThunk";
import {
  AsyncThunkOptions,
  AsyncThunkPayloadCreator,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { Axios } from "axios";
import { RootStateType } from "./store";

type CustomAsyncThunkConfig = AsyncThunkConfig & {
  extra: Axios;
  state: RootStateType;
};

/** Created this function to correctly type cast the extra arguments to Axios and getState to App Root State.
 * If you want to use axios passed in the extra arguments. Use this function for async operations.
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
