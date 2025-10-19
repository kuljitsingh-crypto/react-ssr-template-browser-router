import React from "react";
import {
  Error,
  FieldTextInput,
  FormattedMsg,
  InlineTextButton,
  PrimaryButton,
} from "@src/components";
import { useForm } from "rc-simple-hook-form";
import { IntlShape } from "react-intl";
import { GeneralError } from "@src/util/APITypes";
import css from "./LoginForm.module.css";
import classNames from "classnames";
import { FetchStatusVal } from "@src/util/fetchStatusHelper";

type LoginProps = {
  intl: IntlShape;
  loginInProgress: boolean;
  loginError: GeneralError | null;
  loginStatus: FetchStatusVal;
  onSubmit: (email: string, password: string) => void;
  onNavigateToForgotPassword: () => void;
};
function LoginForm(props: LoginProps) {
  const {
    intl,
    loginInProgress,
    loginError,
    loginStatus,
    onSubmit,
    onNavigateToForgotPassword,
  } = props;
  const {
    control,
    formState: { isEmpty, invalid },
    handleSubmit,
  } = useForm();
  const emailLabel = intl.formatMessage({ id: "LoginPage.emailLabel" });
  const emailPlaceholder = intl.formatMessage({
    id: "LoginPage.emailPlaceholder",
  });
  const passwordLabel = intl.formatMessage({ id: "LoginPage.passwordLabel" });
  const passwordPlaceholder = intl.formatMessage({
    id: "LoginPage.passwordPlaceholder",
  });
  const submitBtnTitle = intl.formatMessage({ id: "LoginPage.submitButton" });
  const invalidEmail = intl.formatMessage({ id: "LoginPage.invalidEmail" });
  const invalidPassword = intl.formatMessage({
    id: "LoginPage.invalidPassword",
  });
  const onFormSubmit = (data: Record<string, any>) => {
    onSubmit(data.email, data.password);
  };
  const submitDisabled = isEmpty || invalid;
  const errorText =
    loginError?.code === "ERR_BAD_REQUEST"
      ? intl.formatMessage({ id: "LoginPage.invalidCredential" })
      : intl.formatMessage({ id: "LoginPage.loginFailed" });
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={css.formRoot}>
      <FieldTextInput
        id='email'
        name='email'
        label={emailLabel}
        placeholder={emailPlaceholder}
        control={control}
        type='text'
        validations={{ validEmail: invalidEmail }}
        inputContainerClassName={css.input}
      />
      <FieldTextInput
        id='password'
        name='password'
        label={passwordLabel}
        placeholder={passwordPlaceholder}
        control={control}
        type='password'
        validations={{ required: invalidPassword }}
        inputContainerClassName={css.input}
      />

      <div className={css.actionBtnDiv}>
        <p className={classNames("linkTextContainer", css.linkText)}>
          <FormattedMsg id='LoginPage.forgotPwd' />
          <InlineTextButton
            type='button'
            onClick={onNavigateToForgotPassword}
            buttonClassName={"linkBtn"}>
            <FormattedMsg id='LoginPage.resetPwdBtn' />
          </InlineTextButton>
        </p>
        <Error status={loginStatus} error={loginError} errorMsg={errorText} />
        <PrimaryButton
          type='submit'
          title={submitBtnTitle}
          disabled={submitDisabled}
          buttonClassName={css.submitBtn}
          isLoading={loginInProgress}
        />
      </div>
    </form>
  );
}

export default LoginForm;
