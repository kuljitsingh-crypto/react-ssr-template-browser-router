import React from "react";
import { customConnect } from "@src/components/helperComponents/customConnect";
import {
  UseDispatchType,
  useFetchStatusHandler,
  useNamedRedirect,
  UseSelectorType,
} from "@src/hooks";
import { selectStateValue } from "@src/storeHelperFunction";
import { FormattedMsg, InlineTextButton, NamedRedirect } from "@src/components";
import { IntlShape } from "react-intl";
import { useConfiguration } from "@src/context";
import Page from "@src/components/Page/Page";
import RightChild from "@src/components/RIghtChild/RightChild";
import ForgotPasswordForm from "@src/Form/ForgotPasswordForm/ForgotPasswordForm";
import { fetchStatus } from "@src/custom-config";
import {
  resetLogInStatus,
  sendPasswordResetInstruction,
} from "@src/globalReducers/auth.slice";
import css from "./ForgotPassword.module.css";

const mapStateToProps = (selector: UseSelectorType) => {
  const isAuthenticated = selector(selectStateValue("auth", "isAuthenticated"));
  const forgotPasswordStatus = selector(
    selectStateValue("auth", "forgotPasswordStatus")
  );
  const forgotPasswordError = selector(
    selectStateValue("auth", "forgotPasswordError")
  );
  return { isAuthenticated, forgotPasswordStatus, forgotPasswordError };
};
const mapDispatchToProps = (dispatch: UseDispatchType) => ({
  onSendInstruction: (email: string) =>
    dispatch(sendPasswordResetInstruction({ email })),
  onResetLoginStatus: () => dispatch(resetLogInStatus()),
});

type ForgotPasswordPasswordProps = { intl: IntlShape } & ReturnType<
  typeof mapStateToProps
> &
  ReturnType<typeof mapDispatchToProps>;

function ForgotPassword(props: ForgotPasswordPasswordProps) {
  const {
    isAuthenticated,
    forgotPasswordError,
    forgotPasswordStatus,
    intl,
    onSendInstruction,
    onResetLoginStatus,
  } = props;
  const config = useConfiguration();
  const title = intl.formatMessage({ id: "ForgotPasswordPage.title" });
  const desc =
    config.seo.description || intl.formatMessage({ id: "general.description" });
  const navigate = useNamedRedirect();
  const navigateToLogin = () => {
    onResetLoginStatus();
    navigate("LoginPage");
  };

  const handleSubmit = (email: string) => {
    onSendInstruction(email);
  };
  const onForgotPasswordSuccess = () => {
    navigateToLogin();
  };

  useFetchStatusHandler({
    fetchStatus: forgotPasswordStatus,
    fetchError: forgotPasswordError,
    callback: { succeeded: { handler: onForgotPasswordSuccess } },
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
                id='ForgotPasswordPage.helperText'
                className={css.helperText}
              />
            </p>
            <p className={css.helperBody}>
              <FormattedMsg id='ForgotPasswordPage.sendInstruction.body' />
            </p>
            <ForgotPasswordForm
              intl={intl}
              onSubmit={handleSubmit}
              forgotPasswordInProgress={fetchStatus.isLoading(
                forgotPasswordStatus
              )}
              forgotPasswordError={forgotPasswordError}
            />
            <div className={"linkTextContainer"}>
              <FormattedMsg id='ForgotPasswordPage.loginRedirect' />
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

export default customConnect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPassword);
