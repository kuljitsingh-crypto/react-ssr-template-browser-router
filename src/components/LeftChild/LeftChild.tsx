import classNames from "classnames";
import React from "react";

type LeftChildProps = {
  rootClassName?: string;
  className?: string;
};
function LeftChild(props: LeftChildProps) {
  const { rootClassName, className } = props;
  const leftChildClass = classNames(rootClassName, className);
  return <div className={leftChildClass}>LeftChild</div>;
}

export default LeftChild;
