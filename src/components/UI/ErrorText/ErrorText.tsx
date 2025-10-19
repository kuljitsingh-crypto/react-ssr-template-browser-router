import { GeneralError } from "@src/util/APITypes";
import { FetchStatus } from "@src/util/fetchStatusHelper";
import React from "react";

type ErrorTextProps = {
  status: FetchStatus;
  error: GeneralError | null;
  errorMsg?: string;
};
function ErrorText(props: ErrorTextProps) {
  const { status, error, errorMsg } = props;
  const msg = errorMsg || error?.message || "";
  return status.isFailed ? <p className='errorText'>{msg}</p> : null;
}

export default ErrorText;
