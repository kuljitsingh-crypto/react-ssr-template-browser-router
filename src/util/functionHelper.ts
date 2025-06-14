const THROTTLE_WAIT_MS = 200; // 200 ms
const DEBOUNCE_WAIT_MS = 200; // 200 ms

const BREAK_POINTS = {
  mobile: 576,
  tablet: 768,
  desktop: 992,
  largeDesktop: 1200,
};

export const throttleFunc = <ParamType>(
  func: (param: ParamType) => void,
  throttleInterval = THROTTLE_WAIT_MS
) => {
  let shouldCallFunc = true;
  return (param: ParamType) => {
    if (shouldCallFunc) {
      shouldCallFunc = false;
      func(param);
      setTimeout(() => {
        shouldCallFunc = true;
      }, throttleInterval);
    }
  };
};

export const debounceFunc = <ParamType>(
  func: (param: ParamType) => void,
  throttleInterval = DEBOUNCE_WAIT_MS
) => {
  let throttleTimeout: NodeJS.Timeout | undefined = undefined;
  return (param: ParamType) => {
    if (throttleTimeout) clearTimeout(throttleTimeout);
    throttleTimeout = setTimeout(() => {
      func(param);
    }, throttleInterval);
  };
};

export const waitFor = (waitTime = 1000): Promise<{ data: "success" }> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: "success" }), waitTime);
  });
};

const parseQueryValue = (value: string) => {
  if (value === undefined) return null;
  value = decodeURIComponent(value);
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
};

export function parseQueryString(queryString: string) {
  const queries = (queryString || "").replace("?", "").split("&");
  const paramObject = queries.reduce((acc, str) => {
    const [key, value] = str.split("=");
    if (key) {
      acc[key] = parseQueryValue(value);
    }
    return acc;
  }, {} as Record<string, string>);

  return paramObject;
}

export const createQueryString = (queryParams?: Record<string, any>) => {
  let queryStr = Object.entries(queryParams || {}).reduce(
    (acc, [key, value]) => {
      if (acc) {
        acc += "&";
      }
      acc += `${key}=${encodeURIComponent(value)}`;
      return acc;
    },
    ""
  );
  if (queryStr) {
    queryStr = `?${queryStr}`;
  }
  return queryStr;
};

export const isMobileScreen = (width: number) => {
  return width < BREAK_POINTS.mobile;
};

export const isTabletScreen = (width: number) => {
  return width >= BREAK_POINTS.mobile && width < BREAK_POINTS.tablet;
};

export const isSmallDesktopScreen = (width: number) => {
  return width >= BREAK_POINTS.tablet && width < BREAK_POINTS.desktop;
};

export const isLargeDesktopScreen = (width: number) => {
  return width >= BREAK_POINTS.desktop && width < BREAK_POINTS.largeDesktop;
};
