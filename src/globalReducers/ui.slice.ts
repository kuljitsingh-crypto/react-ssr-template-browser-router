import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { rippleAnimationDuration, Theme } from "@src/custom-config";
import { RootStateType } from "@src/store";
import { isBrowser } from "@src/util/browserHelperFunction";
import { isAppHasDarkTheme } from "@src/util/themeHelper";

const setRootElementVariable = (theme: Theme) => {
  if (typeof document !== "undefined" && isBrowser()) {
    const isDarkTheme = isAppHasDarkTheme(theme);
    const themeBgColor = isDarkTheme
      ? "--colorBgDarkThemeComp"
      : "--colorBgLightThemeComp";
    const themeTextColor = isDarkTheme
      ? "--colorDarkThemeComp"
      : "--colorLightThemeComp";
    const themeHoverColor = isDarkTheme
      ? "--colorHoverDarkTheme"
      : "--colorHoverLightTheme";

    const rootElement = document.querySelector(":root");

    if (rootElement) {
      const style = getComputedStyle(rootElement);
      const themeBgClr = style.getPropertyValue(themeBgColor);
      const themeTextClr = style.getPropertyValue(themeTextColor);
      const themeHoverClr = style.getPropertyValue(themeHoverColor);
      document.body.style.setProperty(
        "--rippleAnimDuration",
        `${rippleAnimationDuration}ms`
      );
      document.body.style.setProperty("--themeBgColor", `${themeBgClr}`);
      document.body.style.setProperty("--themeTextColor", `${themeTextClr}`);
      document.body.style.setProperty("--themeHoverColor", `${themeHoverClr}`);
    }
  }
};

type InitialState = {
  theme: Theme;
};

const initialState: InitialState = {
  theme: "dark",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    changeTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      setRootElementVariable(action.payload);
    },
  },
});

export const { changeTheme } = uiSlice.actions;

export const selectTheme = (state: RootStateType) => state.ui.theme;

export default uiSlice.reducer;
