import React from "react";
import classNames from "classnames";
import BrandIcon from "../BrandIcon/BrandIcon";
import { IoMdClose } from "react-icons/io";

import Divider from "../Divider/Divider";
import { InlineTextButton } from "../UI/Button/Button";
import css from "./LeftChild.module.css";
import NamedLink from "../NamedLink/NamedLink";

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
        <NamedLink name='Homepage'>
          <BrandIcon className={css.brandIcon} />
        </NamedLink>
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
