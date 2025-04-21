import React, { useContext } from "react";

type ScreenDimensionContext = { width: number; height: number };

const ScreenDimension = React.createContext<ScreenDimensionContext>(
  {} as ScreenDimensionContext
);

export const useScreenDimension = () => {
  const context = useContext(ScreenDimension);
  return context;
};

export const ScreenDimensionProvider = ScreenDimension.Provider;
