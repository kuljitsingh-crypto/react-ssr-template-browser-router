import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

function FormattedMsg(props: {
  id: string;
  values?: Record<string, any>;
  className?: string;
}) {
  const { id, values, className } = props;
  return (
    <span className={classNames(className)}>
      <FormattedMessage id={id} values={values} />
    </span>
  );
}

export default FormattedMsg;
