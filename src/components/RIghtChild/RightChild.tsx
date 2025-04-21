import { selectIsAuthenticated } from "@src/globalReducers/auth.slice";
import { UseSelectorType } from "@src/hooks";
import classNames from "classnames";
import React from "react";
import { customConnect } from "../helperComponents/customConnect";
import Topbar from "../Topbar/Topbar";
import css from "./RightChild.module.css";

const mapStateToProps = (selector: UseSelectorType) => {
  const isAuthenticated = selector(selectIsAuthenticated);
  return { isAuthenticated };
};

type RightChildProps = {
  rootClassName?: string;
  className?: string;
} & { children?: React.ReactNode } & ReturnType<typeof mapStateToProps>;

function RightChildComp(props: RightChildProps) {
  const { children, rootClassName, className } = props;
  const rightChildClass = classNames(rootClassName, css.root, className);
  return (
    <div className={rightChildClass}>
      <Topbar />
      {children}
    </div>
  );
}

const RightChild = customConnect(mapStateToProps)(RightChildComp);
export default RightChild;
