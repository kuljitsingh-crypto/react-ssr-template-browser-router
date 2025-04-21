import { throttleFunc } from "@src/util/functionHelper";
import React, { useCallback, useEffect, useState } from "react";

export interface WindowDimension {
  width: number;
  height: number;
}

function useWindowDimension() {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimension>({
    width: 0,
    height: 0,
  });

  const handleResize = () => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const handleLoad = () => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttleHandleResize = useCallback(throttleFunc(handleResize), []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      handleLoad();
      window.addEventListener("resize", throttleHandleResize);
      window.addEventListener("load", handleLoad);
      return () => {
        window.removeEventListener("resize", throttleHandleResize);
        window.removeEventListener("load", handleLoad);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { windowDimensions };
}

export const windowDimensionProvider = <
  OwnProps extends Record<string, any> = Record<string, any>
>(
  Component: React.JSXElementConstructor<
    OwnProps & { windowDimensions: WindowDimension }
  >
) => {
  return function WrappedComponent(props: OwnProps) {
    const { windowDimensions } = useWindowDimension();
    const mergedProps = {
      ...props,
      windowDimensions,
    } as OwnProps & { windowDimensions: WindowDimension };
    return <Component {...mergedProps} />;
  };
};
