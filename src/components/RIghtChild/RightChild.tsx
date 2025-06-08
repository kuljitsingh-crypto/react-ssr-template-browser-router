import { UseSelectorType } from "@src/hooks";
import classNames from "classnames";
import React from "react";
import { customConnect } from "../helperComponents/customConnect";
import Topbar from "../Topbar/Topbar";
import css from "./RightChild.module.css";
import { selectStateValue } from "@src/storeHelperFunction";

const mapStateToProps = (selector: UseSelectorType) => {
  const isAuthenticated = selector(selectStateValue("auth", "isAuthenticated"));
  return { isAuthenticated };
};

type RightChildProps = {
  rootClassName?: string;
  className?: string;
  showLeftChild?: boolean;
  toggleLeftChild?: () => void;
} & { children?: React.ReactNode } & ReturnType<typeof mapStateToProps>;

function RightChildComp(props: RightChildProps) {
  const { children, rootClassName, className, showLeftChild, toggleLeftChild } =
    props;
  const rightChildClass = classNames(rootClassName, css.root, className, {
    [css.tabShowRoot]: !showLeftChild,
  });
  return (
    <div className={rightChildClass}>
      <Topbar showLeftChild={showLeftChild} toggleLeftChild={toggleLeftChild} />
      {children}
    </div>
  );
}

const RightChild = customConnect(mapStateToProps)(RightChildComp);
export default RightChild;
