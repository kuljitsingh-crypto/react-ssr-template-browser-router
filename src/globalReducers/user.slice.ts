import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FETCH_STATUS, FetchStatusVal } from "@src/custom-config";
import { customCreateAsyncThunk } from "@src/storeHelperFunction";
import { setAuthenticationState } from "./auth.slice";
import { CurrentUser } from "@src/util/APITypes";
import { waitFor } from "@src/util/functionHelper";

type InitialState = {
  currentUser: CurrentUser | null;
  currentUserFetchStatus: FetchStatusVal;
};

const CURRENT_USER_NAME = "app/current_user";
const CURRENT_USER_FETCH_NAME = "app/current_user/fetch";

const initialState: InitialState = {
  currentUser: null,
  currentUserFetchStatus: FETCH_STATUS.idle,
};

export const fetchCurrentUser = customCreateAsyncThunk<CurrentUser, void>(
  CURRENT_USER_FETCH_NAME,
  async (
    _,
    { extra: { axiosWithCredentials, config }, dispatch, getState }
  ) => {
    // your Custom login logic
    const resp = await waitFor(2000);
    const isAlreadyAuthenticated = getState().auth.isAuthenticated;
    if (resp.data === "success" && !isAlreadyAuthenticated) {
      dispatch(setAuthenticationState(true));
    }
    // your custom return
    return {};
  }
);

const currentUserSlice = createSlice({
  name: CURRENT_USER_NAME,
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<CurrentUser | null>) => {
      state.currentUser = action.payload;
      state.currentUserFetchStatus = action.payload
        ? FETCH_STATUS.succeeded
        : FETCH_STATUS.idle;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.currentUserFetchStatus = FETCH_STATUS.loading;
        state.currentUser = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUserFetchStatus = FETCH_STATUS.succeeded;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.currentUserFetchStatus = FETCH_STATUS.failed;
      });
  },
});

export default currentUserSlice.reducer;
export const { setCurrentUser } = currentUserSlice.actions;
