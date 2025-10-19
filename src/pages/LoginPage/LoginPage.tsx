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
  resetForgotPasswordStatus,
  resetLogoutStatus,
  resetSignupStatus,
  userLogin,
} from "@src/globalReducers/auth.slice";
import { customConnect } from "@src/components/helperComponents/customConnect";
import css from "./LoginPage.module.css";
import { GeneralError } from "@src/util/APITypes";
import {
  BrandIcon,
  FormattedMsg,
  InlineTextButton,
  NamedRedirect,
} from "@src/components";
import RightChild from "@src/components/RIghtChild/RightChild";
import { selectStateValue } from "@src/storeHelperFunction";
import { FetchStatusVal } from "@src/util/fetchStatusHelper";

const mapStateToProps = (selector: UseSelectorType) => {
  const loginStatus = selector(selectStateValue("auth", "loginStatus"));
  const loginError = selector(selectStateValue("auth", "loginError"));
  const isAuthenticated = selector(selectStateValue("auth", "isAuthenticated"));
  return { loginStatus, loginError, isAuthenticated };
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onUserLogin: (email: string, password: string) =>
    dispatch(userLogin({ email, password })),
  onResetLogoutStatus: () => dispatch(resetLogoutStatus()),
  onResetSingUpStatus: () => dispatch(resetSignupStatus()),
  onResetForgotPasswordStatus: () => dispatch(resetForgotPasswordStatus()),
});

type LoginPageProps = {
  loginStatus: FetchStatusVal;
  loginError: GeneralError | null;
  isAuthenticated: boolean;
} & ReturnType<typeof mapDispatchToProps>;

function LoginPage(props: LoginPageProps) {
  const {
    loginError,
    loginStatus,
    isAuthenticated,
    onResetLogoutStatus,
    onUserLogin,
    onResetSingUpStatus,
    onResetForgotPasswordStatus,
  } = props;
  const intl = useIntl();
  const config = useConfiguration();
  const title = intl.formatMessage({ id: "LoginPage.title" });
  const desc =
    config.seo.description || intl.formatMessage({ id: "general.description" });
  const navigate = useNamedRedirect();

  const handleSubmit = (email: string, password: string) => {
    onUserLogin(email, password);
  };
  const onLoginSuccess = () => {
    navigate("Homepage", { replace: true });
  };
  const navigateToSignup = () => {
    onResetLogoutStatus();
    onResetSingUpStatus();
    navigate("SignupPage");
  };
  const onNavigateToForgotPassword = () => {
    onResetLogoutStatus();
    onResetForgotPasswordStatus();
    navigate("ForgotPassword");
  };

  useFetchStatusHandler({
    fetchStatus: loginStatus,
    fetchError: loginError,
    succeeded: onLoginSuccess,
  });
  if (isAuthenticated) {
    return <NamedRedirect name='Homepage' replace={true} />;
  }
  return (
    <Page
      metaTitle={title}
      description={desc}
      contentRootClassName={css.pageRoot}>
      <RightChild>
        <div className={css.loginBody}>
          <div className={css.bodyContainer}>
            <BrandIcon />
            <p className={css.helperTextDiv}>
              <span className={css.divider} />
              <FormattedMsg
                id='LoginPage.helpText'
                className={css.helperText}
              />
            </p>
            <LoginForm
              intl={intl}
              loginInProgress={loginStatus.isLoading}
              loginError={loginError}
              onSubmit={handleSubmit}
              onNavigateToForgotPassword={onNavigateToForgotPassword}
            />
            <div className={"linkTextContainer"}>
              <FormattedMsg id='LoginPage.noAccount' />
              <InlineTextButton
                type='button'
                onClick={navigateToSignup}
                buttonClassName={"linkBtn"}>
                <FormattedMsg id='SignupPage.submitButton' />
              </InlineTextButton>
            </div>
          </div>
        </div>
      </RightChild>
    </Page>
  );
}

export default customConnect(mapStateToProps, mapDispatchToProps)(LoginPage);
