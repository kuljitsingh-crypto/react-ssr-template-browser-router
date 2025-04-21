import { Theme } from "@src/custom-config";

export const isSystemHasDarkTheme = (theme: Theme) => {
  if (typeof window === "undefined") {
    return false;
  }
  return (
    theme === "system" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

export const isSystemHasLightTheme = (theme: Theme) => {
  if (typeof window === "undefined") {
    return true;
  }
  return (
    theme === "system" &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  );
};

export const isAppHasLightTheme = (theme: Theme) => {
  return theme === "light" || isSystemHasLightTheme(theme);
};

export const isAppHasDarkTheme = (theme: Theme) => {
  return theme === "dark" || isSystemHasDarkTheme(theme);
};
