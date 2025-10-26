import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { customCreateAsyncThunk } from "@src/storeHelperFunction";
import { setAuthenticationState } from "./auth.slice";
import { CurrentUser } from "@src/util/APITypes";
import { waitFor } from "@src/util/functionHelper";
import { FetchStatus, FetchStatusVal } from "@src/util/fetchStatusHelper";
import { csrfToken } from "@src/util/csrfTokenHelper";

type InitialState = {
  currentUser: CurrentUser | null;
  currentUserFetchStatus: FetchStatusVal;
};

const CURRENT_USER_NAME = "app/current_user";
const CURRENT_USER_FETCH_NAME = "app/current_user/fetch";

const initialState: InitialState = {
  currentUser: null,
  currentUserFetchStatus: new FetchStatus(),
};

export const fetchCurrentUser = customCreateAsyncThunk<CurrentUser, void>(
  CURRENT_USER_FETCH_NAME,
  async (_, { extra: { coreApi, config }, dispatch, getState }) => {
    // your Custom login logic
    const resp = await waitFor(1000);
    const isAlreadyAuthenticated = getState().auth.isAuthenticated;
    if (resp.data === "success" && !isAlreadyAuthenticated) {
      dispatch(setAuthenticationState(true));
    }
    await csrfToken.setAsync(config);
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
        ? FetchStatus.succeeded
        : FetchStatus.idle;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.currentUserFetchStatus = FetchStatus.loading;
        state.currentUser = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUserFetchStatus = FetchStatus.succeeded;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.currentUserFetchStatus = FetchStatus.failed;
      });
  },
});

export default currentUserSlice.reducer;
export const { setCurrentUser } = currentUserSlice.actions;
