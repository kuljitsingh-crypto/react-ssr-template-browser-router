import React from "react";
import { useIntl } from "react-intl";
import Page from "@src/components/Page/Page";
import { useConfiguration } from "@src/context";
import { AppDispatch } from "@src/store";
import {
  useFetchStatusHandler,
  useNamedRedirect,
  UseSelectorType,
} from "@src/hooks";
import { resetLogInStatus, userSignup } from "@src/globalReducers/auth.slice";
import { customConnect } from "@src/components/helperComponents/customConnect";
import { fetchStatus, FetchStatusVal } from "@src/custom-config";
import css from "./SignupPage.module.css";
import { GeneralError } from "@src/util/APITypes";
import { FormattedMsg, InlineTextButton, NamedRedirect } from "@src/components";
import RightChild from "@src/components/RIghtChild/RightChild";
import SignupForm from "@src/Form/SignupForm/SignupForm";
import { selectStateValue } from "@src/storeHelperFunction";

const mapStateToProps = (selector: UseSelectorType) => {
  const signupStatus = selector(selectStateValue("auth", "signupStatus"));
  const signupError = selector(selectStateValue("auth", "signupError"));
  const isAuthenticated = selector(selectStateValue("auth", "isAuthenticated"));
  return { signupStatus, signupError, isAuthenticated };
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onUserSignup: (email: string, password: string) =>
    dispatch(userSignup({ email, password })),
  onResetLogInStatus: () => dispatch(resetLogInStatus()),
});

type SignupPageProps = {
  signupStatus: FetchStatusVal;
  signupError: GeneralError | null;
  isAuthenticated: boolean;
} & ReturnType<typeof mapDispatchToProps>;

function SignupPage(props: SignupPageProps) {
  const {
    isAuthenticated,
    signupStatus,
    signupError,
    onUserSignup,
    onResetLogInStatus,
  } = props;
  const intl = useIntl();
  const config = useConfiguration();
  const title = intl.formatMessage({ id: "SignupPage.title" });
  const desc =
    config.seo.description || intl.formatMessage({ id: "general.description" });
  const navigate = useNamedRedirect();

  const handleSubmit = (email: string, password: string) => {
    onUserSignup(email, password);
  };
  const onSignupSuccess = () => {
    navigate("Homepage", { replace: true });
  };

  const navigateToLogin = () => {
    onResetLogInStatus();
    navigate("LoginPage");
  };

  useFetchStatusHandler({
    fetchStatus: signupStatus,
    fetchError: signupError,
    callback: { succeeded: { handler: onSignupSuccess } },
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
            <img src={config.branding.icon} alt='' />
            <p className={css.helperTextDiv}>
              <span className={css.divider} />
              <FormattedMsg
                id='SignupPage.helpText'
                className={css.helperText}
              />
            </p>
            <SignupForm
              intl={intl}
              onSubmit={handleSubmit}
              signupInProgress={fetchStatus.isLoading(signupStatus)}
              signupError={signupError}
            />
            <div className={"linkTextContainer"}>
              <FormattedMsg id='SignupPage.alreadyAccount' />
              <InlineTextButton
                type='button'
                onClick={navigateToLogin}
                buttonClassName={"linkBtn"}>
                <FormattedMsg id='LoginPage.submitButton' />
              </InlineTextButton>
            </div>
          </div>
        </div>
      </RightChild>
    </Page>
  );
}

export default customConnect(mapStateToProps, mapDispatchToProps)(SignupPage);
