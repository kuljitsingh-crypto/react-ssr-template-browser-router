import { AppSelect } from "@src/hooks";
import classNames from "classnames";
import React from "react";
import { customConnect } from "../helperComponents/customConnect";
import Topbar from "../Topbar/Topbar";
import css from "./RightChild.module.css";

const mapStateToProps = (select: AppSelect) => {
  const { isAuthenticated } = select({
    isAuthenticated: "auth.isAuthenticated",
  });
  return { isAuthenticated };
};

type RightChildProps = {
  rootClassName?: string;
  className?: string;
  showLeftChild?: boolean;
  toggleLeftChild?: () => void;
  hasLeftChild?: boolean;
  showTopbar?: boolean;
} & { children?: React.ReactNode } & ReturnType<typeof mapStateToProps>;

function RightChildComp(props: RightChildProps) {
  const {
    children,
    rootClassName,
    className,
    showLeftChild,
    hasLeftChild,
    showTopbar = true,
    toggleLeftChild,
  } = props;
  const rightChildClass = classNames(rootClassName, css.root, className, {
    [css.tabShowRoot]: !showLeftChild,
  });
  return (
    <div className={rightChildClass}>
      {showTopbar ? (
        <Topbar
          showLeftChild={showLeftChild}
          toggleLeftChild={toggleLeftChild}
          hasLeftChild={hasLeftChild}
        />
      ) : null}
      {children}
    </div>
  );
}

const RightChild = customConnect(mapStateToProps)(RightChildComp);
export default RightChild;
