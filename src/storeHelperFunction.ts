import {
  AsyncThunkOptions,
  AsyncThunkPayloadCreator,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { Axios } from "axios";
import { RootStateType } from "./store";
import { ConfigurationType } from "./custom-config";

type AsyncThunkConfig = Parameters<typeof createAsyncThunk>;
type CustomAsyncThunkConfig = AsyncThunkConfig & {
  extra: {
    axios: Axios;
    config: ConfigurationType;
    axiosWithCredentials: Axios;
  };
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

type SliceNames = keyof RootStateType;
export const selectStateValue =
  <
    T extends SliceNames,
    K extends keyof RootStateType[T],
    R = RootStateType[T][K]
  >(
    sliceName: T,
    stateName: K
  ) =>
  (state: RootStateType) => {
    return state[sliceName][stateName] as R;
  };
