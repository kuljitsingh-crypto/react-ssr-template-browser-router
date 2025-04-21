import React from "react";

type ErrorTextProps = {
  shouldShowError: boolean;
  errorMessage: string;
};
function ErrorText(props: ErrorTextProps) {
  const { shouldShowError, errorMessage } = props;
  return shouldShowError ? <p className='errorText'>{errorMessage}</p> : null;
}

export default ErrorText;
