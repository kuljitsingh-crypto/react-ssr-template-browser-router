import React, { useContext } from "react";
import { ConfigurationType, defaultConfig } from "../custom-config";

const ConfigurationContext = React.createContext<{ config: ConfigurationType }>(
  { config: defaultConfig }
);

export const useConfiguration = () => {
  const context = useContext(ConfigurationContext);
  return context.config;
};

export const ConfigurationContextProvider = ConfigurationContext.Provider;
