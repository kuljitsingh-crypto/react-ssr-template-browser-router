import React from "react";
import { useIntl } from "react-intl";
import Page from "@src/components/Page/Page";
import { useConfiguration } from "@src/context";
import { LoginForm } from "@src/Form";
import { AppDispatch } from "@src/store";
import {
  useFetchStatusHandler,
  useNamedRedirect,
  UseSelectorType,
} from "@src/hooks";
import {
  selectIsAuthenticated,
  selectLoginError,
  selectLoginStatus,
  userLogin,
} from "@src/globalReducers/auth.slice";
import { customConnect } from "@src/components/helperComponents/customConnect";
import { FETCH_STATUS, FetchStatusVal } from "@src/custom-config";
import css from "./SignupPage.module.css";
import { GeneralError } from "@src/util/APITypes";
import { FormattedMsg, NamedRedirect } from "@src/components";
import RightChild from "@src/components/RIghtChild/RightChild";

const mapStateToProps = (selector: UseSelectorType) => {
  const loginStatus = selector(selectLoginStatus);
  const loginError = selector(selectLoginError);
  const isAuthenticated = selector(selectIsAuthenticated);
  return { loginStatus, loginError, isAuthenticated };
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onUserLogin: (email: string, password: string) =>
    dispatch(userLogin({ email, password })),
});

type SignupPageProps = {
  loginStatus: FetchStatusVal;
  loginError: GeneralError | null;
  isAuthenticated: boolean;
} & ReturnType<typeof mapDispatchToProps>;

function SignupPage(props: SignupPageProps) {
  const { loginError, loginStatus, isAuthenticated, onUserLogin } = props;
  const intl = useIntl();
  const config = useConfiguration();
  const title = intl.formatMessage({ id: "SignupPage.title" });
  const desc =
    config.seo.description || intl.formatMessage({ id: "general.description" });
  const navigate = useNamedRedirect();

  const handleSubmit = (email: string, password: string) => {
    onUserLogin(email, password);
  };
  const onLoginSuccess = () => {
    navigate("Homepage", { replace: true });
  };

  useFetchStatusHandler({
    fetchStatus: loginStatus,
    fetchError: loginError,
    callback: { succeeded: { handler: onLoginSuccess } },
  });
  if (isAuthenticated) {
    return <NamedRedirect name='Homepage' />;
  }
  return (
    <Page
      metaTitle={title}
      description={desc}
      contentRootClassName={css.pageRoot}>
      <RightChild>
        <div className={css.loginBody}>
          <div className={css.bodyContainer}>
            <img src={config.branding.icon} alt='' />
            <p className={css.helperTextDiv}>
              <span className={css.divider} />
              <FormattedMsg
                id='SignupPage.helpText'
                className={css.helperText}
              />
            </p>
            <LoginForm
              intl={intl}
              onSubmit={handleSubmit}
              loginInProgress={loginStatus === FETCH_STATUS.loading}
              loginError={loginError}
            />
          </div>
        </div>
      </RightChild>
    </Page>
  );
}

export default customConnect(mapStateToProps, mapDispatchToProps)(SignupPage);
