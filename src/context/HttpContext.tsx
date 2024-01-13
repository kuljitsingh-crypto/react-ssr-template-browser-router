import React from "react";
import { isBrowser } from "../utill/browserHelperFunction";

type HttpContextType = Record<string, any>;

const httpContext = React.createContext<HttpContextType>({});

export const addDataToHttpStaticContextInServer = (
  context: Record<string, unknown>,
  data: Record<string, unknown>
): boolean => {
  let isDataAdded = false;
  if (!isBrowser() && context.staticContext) {
    Object.assign(context.staticContext, data);
    isDataAdded = true;
  }
  return isDataAdded;
};

export default function HttpContextProvider(props: {
  context: object;
  children: React.ReactNode;
}) {
  const { children, context } = props;
  const contextValue = { staticContext: context };
  return (
    <httpContext.Provider value={contextValue}>{children}</httpContext.Provider>
  );
}

export { httpContext };
