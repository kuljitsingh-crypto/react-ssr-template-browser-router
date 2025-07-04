import React from "react";
import { ErrorText, FieldTextInput, PrimaryButton } from "@src/components";
import { useForm } from "rc-simple-hook-form";
import css from "./ForgotPasswordForm.module.css";
import { IntlShape } from "react-intl";
import { GeneralError } from "@src/util/APITypes";

type ForgotPasswordFormProps = {
  intl: IntlShape;
  forgotPasswordInProgress: boolean;
  forgotPasswordError: GeneralError | null;
  onSubmit: (email: string) => void;
};

function ForgotPasswordForm(props: ForgotPasswordFormProps) {
  const { intl, forgotPasswordInProgress, forgotPasswordError, onSubmit } =
    props;
  const {
    control,
    formState: { isEmpty, invalid },
    handleSubmit,
  } = useForm();
  const emailLabel = intl.formatMessage({ id: "LoginPage.emailLabel" });
  const emailPlaceholder = intl.formatMessage({
    id: "LoginPage.emailPlaceholder",
  });
  const submitBtnTitle = intl.formatMessage({
    id: "ForgotPasswordPage.submitButton",
  });
  const invalidEmail = intl.formatMessage({ id: "LoginPage.invalidEmail" });
  const onFormSubmit = (data: Record<string, any>) => {
    onSubmit(data.email);
  };
  const submitDisabled = isEmpty || invalid;
  const errorText = intl.formatMessage({
    id: "ForgotPasswordPage.sendInstructionFailed",
  });
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
      <div className={css.actionBtnDiv}>
        <ErrorText
          shouldShowError={!!forgotPasswordError}
          errorMessage={errorText}
        />
        <PrimaryButton
          type='submit'
          title={submitBtnTitle}
          disabled={submitDisabled}
          buttonClassName={css.submitBtn}
          isLoading={forgotPasswordInProgress}
        />
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
