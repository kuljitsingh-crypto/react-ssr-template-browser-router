import React from "react";
import { useIntl } from "react-intl";
import Page from "@src/components/Page/Page";
import { useConfiguration } from "@src/context";
import { LoginForm } from "@src/Form";
import {
  useFetchStatusHandler,
  useNamedRedirect,
  AppSelect,
  AppDispatch,
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
import { FetchStatusVal } from "@src/util/fetchStatusHelper";
import { useLocation } from "react-router-dom";
import { parseQueryString } from "@src/util/functionHelper";

const mapStateToProps = (select: AppSelect) => {
  const state = select({
    loginStatus: "auth.loginStatus",
    loginError: "auth.loginError",
    isAuthenticated: "auth.isAuthenticated",
  });
  return state;
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
  const location = useLocation();
  const intl = useIntl();
  const config = useConfiguration();
  const title = intl.formatMessage({ id: "LoginPage.title" });
  const desc =
    config.seo.description || intl.formatMessage({ id: "general.description" });
  const navigate = useNamedRedirect();

  const { state, search } = location;
  const searchFrom = parseQueryString(search)?.from;
  const from = (state as any)?.from || searchFrom;

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
    const { name = "Homepage", search, hash, params = {} } = from || {};
    return (
      <NamedRedirect
        name={name}
        replace={true}
        search={search}
        hash={hash}
        params={params}
      />
    );
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
              loginStatus={loginStatus}
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
