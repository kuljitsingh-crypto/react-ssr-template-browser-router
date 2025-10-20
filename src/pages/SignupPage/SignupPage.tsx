import React from "react";
import { useIntl } from "react-intl";
import Page from "@src/components/Page/Page";
import { useConfiguration } from "@src/context";

import {
  useFetchStatusHandler,
  useNamedRedirect,
  AppSelect,
  AppDispatch,
} from "@src/hooks";
import { resetLogInStatus, userSignup } from "@src/globalReducers/auth.slice";
import { customConnect } from "@src/components/helperComponents/customConnect";
import css from "./SignupPage.module.css";
import { GeneralError } from "@src/util/APITypes";
import { FormattedMsg, InlineTextButton, NamedRedirect } from "@src/components";
import RightChild from "@src/components/RIghtChild/RightChild";
import SignupForm from "@src/Form/SignupForm/SignupForm";
import { FetchStatusVal } from "@src/util/fetchStatusHelper";
import { useLocation } from "react-router-dom";
import { parseQueryString } from "@src/util/functionHelper";

const mapStateToProps = (select: AppSelect) => {
  const state = select({
    signupStatus: "auth.signupStatus",
    signupError: "auth.signupError",
    isAuthenticated: "auth.isAuthenticated",
  });
  return state;
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
  const location = useLocation();

  const { state, search } = location;
  const searchFrom = parseQueryString(search)?.from;
  const from = (state as any)?.from || searchFrom;

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
    succeeded: onSignupSuccess,
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
              signupInProgress={signupStatus.isLoading}
              signupError={signupError}
              signupStatus={signupStatus}
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
