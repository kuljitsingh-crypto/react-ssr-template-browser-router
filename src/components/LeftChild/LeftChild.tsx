import React from "react";
import classNames from "classnames";
import BrandIcon from "../BrandIcon/BrandIcon";
import { IoMdClose } from "react-icons/io";

import Divider from "../Divider/Divider";
import { InlineTextButton } from "../UI/Button/Button";
import css from "./LeftChild.module.css";

type LeftChildProps = {
  rootClassName?: string;
  className?: string;
  showLeftChild?: boolean;
  toggleLeftChild?: () => void;
};
function LeftChild(props: LeftChildProps) {
  const { rootClassName, className, showLeftChild, toggleLeftChild } = props;
  const leftChildClass = classNames(css.root, rootClassName, className, {
    [css.hiddenRoot]: !showLeftChild,
  });
  const handleClose = () => {
    toggleLeftChild?.();
  };
  return (
    <div className={leftChildClass}>
      <div className={css.top}>
        <BrandIcon className={css.brandIcon} />
        <div className={css.iconWrapper}>
          <InlineTextButton
            type='button'
            buttonClassName={css.closeButton}
            onClick={handleClose}>
            <IoMdClose className={css.closeIcon} />
          </InlineTextButton>
        </div>
      </div>
      <Divider />
    </div>
  );
}

export default LeftChild;
