import React from "react";
import classNames from "classnames";

function Divider(props: { className?: string }) {
  const { className } = props;
  const dividerClass = classNames("divider", className);
  return <div className={dividerClass} />;
}

export default Divider;
