import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Config, rippleAnimationDuration, Theme } from "@src/custom-config";
import { isBrowser } from "@src/util/browserHelperFunction";
import { saveInSessionStorage } from "@src/util/sessionStorage";
import { isAppHasDarkTheme } from "@src/util/themeHelper";

const setRootElementVariable = (theme: Theme) => {
  if (typeof document !== "undefined" && isBrowser()) {
    const isDarkTheme = isAppHasDarkTheme(theme);
    const config = Config.getConfig();

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
    saveInSessionStorage(config.sessionStorageKeys.userTheme, theme);
  }
};

type InitialState = {
  theme: Theme;
};

const initialState: InitialState = {
  theme: "light",
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

export default uiSlice.reducer;
