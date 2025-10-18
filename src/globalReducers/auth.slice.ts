import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { customCreateAsyncThunk } from "@src/storeHelperFunction";
import { GeneralError } from "@src/util/APITypes";
import { fetchCurrentUser, setCurrentUser } from "./user.slice";
import { waitFor } from "@src/util/functionHelper";
import {
  FETCH_STATUS,
  FetchStatus,
  FetchStatusVal,
} from "@src/util/fetchStatusHelper";

type InitialState = {
  isAuthenticated: boolean;
  loginStatus: FetchStatusVal;
  loginError: GeneralError | null;
  logoutStatus: FetchStatusVal;
  logoutError: GeneralError | null;
  signupStatus: FetchStatusVal;
  signupError: GeneralError | null;
  forgotPasswordStatus: FetchStatusVal;
  forgotPasswordError: GeneralError | null;
};

type UserLoginParams = { email: string; password: string };

const initialState: InitialState = {
  isAuthenticated: false,
  loginStatus: new FetchStatus(),
  loginError: null,
  logoutStatus: new FetchStatus(),
  logoutError: null,
  signupStatus: new FetchStatus(),
  signupError: null,
  forgotPasswordStatus: new FetchStatus(),
  forgotPasswordError: null,
};

const AUTH_SLICE = "app/auth-slice";
const LOGIN = "app/auth-slice/userLogin";
const SIGNUP = "app/auth-slice/userSignup";
const LOGOUT = "app/auth-slice/userLogout";
const FORGOT_PASSWORD = "app/auth-slice/forgotPassword";

export const userLogin = customCreateAsyncThunk<string, UserLoginParams>(
  LOGIN,
  async (params, { extra: { config, axiosWithCredentials }, dispatch }) => {
    // const { email, password } = params;
    // your Custom login logic
    const resp = await waitFor(2000);
    await dispatch(fetchCurrentUser());
    return resp.data;
  }
);

export const userSignup = customCreateAsyncThunk<string, UserLoginParams>(
  SIGNUP,
  async (params, { extra: { config, axiosWithCredentials }, dispatch }) => {
    const { email, password } = params;
    // your Custom login logic
    const resp = await waitFor(2000);
    await dispatch(userLogin({ email, password }));
    return resp.data;
  }
);

export const userLogout = customCreateAsyncThunk<string, void>(
  LOGOUT,
  async (_, { extra: { config, axiosWithCredentials }, dispatch }) => {
    // const url = `${getApiBaseUrl(config)}/logout`;
    // const resp = await axiosWithCredentials.post(url, {});
    // your Custom login logic
    const resp = await waitFor(2000);
    dispatch(setCurrentUser(null));
    return resp.data;
  }
);

export const sendPasswordResetInstruction = customCreateAsyncThunk<
  string,
  { email: string }
>(
  FORGOT_PASSWORD,
  async ({ email }, { extra: { config, axios }, dispatch }) => {
    // const url = `${getApiBaseUrl(config)}/logout`;
    // const resp = await axiosWithCredentials.post(url, {});
    // your Custom login logic
    const resp = await waitFor(2000);
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
    resetLogoutStatus: (state) => {
      state.logoutStatus.set(FETCH_STATUS.idle);
    },
    resetLogInStatus: (state) => {
      state.logoutStatus.set(FETCH_STATUS.idle);
    },
    resetSignupStatus: (state) => {
      state.signupStatus.set(FETCH_STATUS.idle);
    },
    resetForgotPasswordStatus: (state) => {
      state.forgotPasswordStatus.set(FETCH_STATUS.idle);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state, action) => {
        state.loginStatus.set(FETCH_STATUS.loading);
        state.logoutStatus.set(FETCH_STATUS.idle);
        state.loginError = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loginStatus.set(FETCH_STATUS.succeeded);
        state.isAuthenticated = true;
      })
      .addCase(userLogin.rejected, (state, action) => {
        const { code, name, message } = action.error;
        state.loginStatus.set(FETCH_STATUS.failed);
        state.loginError = { code, name, message };
      })
      .addCase(userLogout.pending, (state, action) => {
        state.logoutStatus.set(FETCH_STATUS.loading);
        state.loginStatus.set(FETCH_STATUS.idle);
        state.signupStatus.set(FETCH_STATUS.idle);
        state.logoutError = null;
      })
      .addCase(userLogout.fulfilled, (state, action) => {
        state.logoutStatus.set(FETCH_STATUS.succeeded);
        state.isAuthenticated = false;
      })
      .addCase(userLogout.rejected, (state, action) => {
        const { code, name, message } = action.error;
        state.logoutStatus.set(FETCH_STATUS.failed);
        state.logoutError = { code, name, message };
      })
      .addCase(userSignup.pending, (state, action) => {
        state.logoutStatus.set(FETCH_STATUS.idle);
        state.loginStatus.set(FETCH_STATUS.idle);
        state.signupStatus.set(FETCH_STATUS.loading);
        state.signupError = null;
      })
      .addCase(userSignup.fulfilled, (state, action) => {
        state.signupStatus.set(FETCH_STATUS.succeeded);
      })
      .addCase(userSignup.rejected, (state, action) => {
        const { code, name, message } = action.error;
        state.signupStatus.set(FETCH_STATUS.failed);
        state.signupError = { code, name, message };
      })
      .addCase(sendPasswordResetInstruction.pending, (state, action) => {
        state.forgotPasswordStatus.set(FETCH_STATUS.loading);
        state.forgotPasswordError = null;
      })
      .addCase(sendPasswordResetInstruction.fulfilled, (state, action) => {
        state.forgotPasswordStatus.set(FETCH_STATUS.succeeded);
      })
      .addCase(sendPasswordResetInstruction.rejected, (state, action) => {
        const { code, name, message } = action.error;
        state.forgotPasswordStatus.set(FETCH_STATUS.failed);
        state.forgotPasswordError = { code, name, message };
      });
  },
});

export default loginSlice.reducer;
export const {
  setAuthenticationState,
  resetLogoutStatus,
  resetLogInStatus,
  resetSignupStatus,
  resetForgotPasswordStatus,
} = loginSlice.actions;
