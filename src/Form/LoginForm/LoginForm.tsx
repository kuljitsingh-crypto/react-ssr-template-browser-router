import React from "react";
import { ErrorText, FieldTextInput, PrimaryButton } from "@src/components";
import { useForm } from "rc-simple-hook-form";
import { IntlShape } from "react-intl";
import { GeneralError } from "@src/util/APITypes";
import css from "./LoginForm.module.css";

type LoginProps = {
  intl: IntlShape;
  onSubmit: (email: string, password: string) => void;
  loginInProgress: boolean;
  loginError: GeneralError | null;
};
function LoginForm(props: LoginProps) {
  const { intl, loginInProgress, loginError, onSubmit } = props;
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
        <ErrorText shouldShowError={!!loginError} errorMessage={errorText} />
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
