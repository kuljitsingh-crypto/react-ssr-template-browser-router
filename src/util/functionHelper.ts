const THROTTLE_WAIT_MS = 200; // 200 ms
const DEBOUNCE_WAIT_MS = 200; // 200 ms

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
