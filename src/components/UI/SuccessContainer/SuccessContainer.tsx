import { FetchStatusVal } from "@src/util/fetchStatusHelper";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  status: FetchStatusVal;
};

function SuccessContainer(props: Props) {
  const { status, children } = props;
  return status.isSucceeded ? (
    <React.Fragment>{children}</React.Fragment>
  ) : null;
}

export default SuccessContainer;
