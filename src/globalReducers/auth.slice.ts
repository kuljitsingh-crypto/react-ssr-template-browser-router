import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FETCH_STATUS, FetchStatusVal } from "../custom-config";
import { customCreateAsyncThunk } from "@src/storeHelperFunction";
import { RootStateType } from "@src/store";
import { GeneralError } from "@src/util/APITypes";
import { fetchCurrentUser, setCurrentUser } from "./user.slice";
import { waitFor } from "@src/util/functionHelper";

type InitialState = {
  isAuthenticated: boolean;
  loginStatus: FetchStatusVal;
  loginError: GeneralError | null;
  logoutStatus: FetchStatusVal;
  logoutError: GeneralError | null;
};

type UserLoginParams = { email: string; password: string };

const initialState: InitialState = {
  isAuthenticated: false,
  loginStatus: FETCH_STATUS.idle,
  loginError: null,
  logoutStatus: FETCH_STATUS.idle,
  logoutError: null,
};

const AUTH_SLICE = "app/auth-slice";
const LOGIN = "app/auth-slice/userLogin";
const LOGOUT = "app/auth-slice/userLogout";

export const userLogin = customCreateAsyncThunk<string, UserLoginParams>(
  LOGIN,
  async (params, { extra: { axios, config }, dispatch }) => {
    // const { email, password } = params;
    // your Custom login logic
    const resp = await waitFor(2000);
    await dispatch(fetchCurrentUser());
    return resp.data;
  }
);

export const userLogout = customCreateAsyncThunk<string, void>(
  LOGOUT,
  async (_, { extra: { axios, config }, dispatch }) => {
    // const url = `${getApiBaseUrl(config)}/logout`;
    // const resp = await axios.post(url, {});
    // your Custom login logic
    const resp = await waitFor(2000);
    dispatch(setCurrentUser(null));
    return resp.data;
  }
);

export const loginSlice = createSlice({
  name: AUTH_SLICE,
  initialState,
  reducers: {
    setAuthenticationState: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state, action) => {
        state.loginStatus = FETCH_STATUS.loading;
        state.logoutStatus = FETCH_STATUS.idle;
        state.loginError = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loginStatus = FETCH_STATUS.succeeded;
        state.isAuthenticated = true;
      })
      .addCase(userLogin.rejected, (state, action) => {
        const { code, name, message } = action.error;
        state.loginStatus = FETCH_STATUS.failed;
        state.loginError = { code, name, message };
      })
      .addCase(userLogout.pending, (state, action) => {
        state.logoutStatus = FETCH_STATUS.loading;
        state.loginStatus = FETCH_STATUS.idle;
        state.logoutError = null;
      })
      .addCase(userLogout.fulfilled, (state, action) => {
        state.logoutStatus = FETCH_STATUS.succeeded;
        state.isAuthenticated = false;
      })
      .addCase(userLogout.rejected, (state, action) => {
        const { code, name, message } = action.error;
        state.logoutStatus = FETCH_STATUS.failed;
        state.logoutError = { code, name, message };
      });
  },
});

export default loginSlice.reducer;
export const { setAuthenticationState } = loginSlice.actions;
export const selectIsAuthenticated = (state: RootStateType) =>
  state.auth.isAuthenticated;
export const selectLoginStatus = (state: RootStateType) =>
  state.auth.loginStatus;

export const selectLoginError = (state: RootStateType) => state.auth.loginError;
export const selectLogoutStatus = (state: RootStateType) =>
  state.auth.logoutStatus;

export const selectLogoutError = (state: RootStateType) =>
  state.auth.logoutError;
