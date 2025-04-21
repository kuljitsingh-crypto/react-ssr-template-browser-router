import React from "react";
import { selectIsAuthenticated } from "@src/globalReducers/auth.slice";
import NamedRedirect from "../NamedRedirect/NamedRedirect";
import { useSelector } from "react-redux";

type AuthenticatedPageState = {
  children: React.JSX.Element;
  name: string;
};

function AuthenticatedPage(props: AuthenticatedPageState) {
  const { children, name } = props;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (!isAuthenticated) {
    return <NamedRedirect name='LoginPage' replace={true} />;
  }

  return (
    <React.Fragment>{React.cloneElement(children, { name })}</React.Fragment>
  );
}

export default AuthenticatedPage;
