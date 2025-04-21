import AuthSlice from "./auth.slice";
import userSlice from "./user.slice";
import uiSlice from "./ui.slice";

export const globalReducer = {
  auth: AuthSlice,
  user: userSlice,
  ui: uiSlice,
};
