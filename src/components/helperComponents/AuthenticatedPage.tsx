import React from "react";
import NamedRedirect from "../NamedRedirect/NamedRedirect";
import { useSelector } from "react-redux";
import { selectStateValue } from "@src/storeHelperFunction";

type AuthenticatedPageState = {
  children: React.JSX.Element;
  name: string;
};

function AuthenticatedPage(props: AuthenticatedPageState) {
  const { children, name } = props;
  const isAuthenticated = useSelector(
    selectStateValue("auth", "isAuthenticated")
  );
  if (!isAuthenticated) {
    return <NamedRedirect name='LoginPage' replace={true} />;
  }

  return (
    <React.Fragment>{React.cloneElement(children, { name })}</React.Fragment>
  );
}

export default AuthenticatedPage;
