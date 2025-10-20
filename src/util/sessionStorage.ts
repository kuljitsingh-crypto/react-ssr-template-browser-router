import { isBrowser } from "./browserHelperFunction";

const CUSTOM_TYPES = {
  date: "DATE",
};

function replacer(key: any, value: any) {
  if (value instanceof Date) {
    return { __type: CUSTOM_TYPES.date, value: value.toISOString() };
  }
  return value;
}

function reviver(key: any, value: any) {
  if (
    typeof value === "object" &&
    value !== null &&
    value.__type === CUSTOM_TYPES.date &&
    typeof value.value !== "undefined"
  ) {
    return new Date(value.value);
  }
  return value;
}

export const saveInSessionStorage = (key: string, data: any) => {
  if (!isBrowser()) return;
  try {
    const dataStr = JSON.stringify(data, replacer);
    window.sessionStorage.setItem(key, dataStr);
  } catch (e) {}
};

export const getFrmSessionStorage = (key: string) => {
  if (!isBrowser()) return;
  try {
    const storedData = window.sessionStorage.getItem(key);
    if (storedData == null) {
      return null;
    }
    return JSON.parse(storedData, reviver);
  } catch (e) {
    return null;
  }
};
