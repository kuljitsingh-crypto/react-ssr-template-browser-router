import classNames from "classnames";
import React, { useState } from "react";
import css from "./Menu.module.css";

type MenuLabelProps = {
  menuLabelClassName?: string;
  menuLabelOpenClassName?: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggleActive?: (enforceState?: boolean) => void;
};
function MenuLabel(props: MenuLabelProps) {
  const {
    isOpen,
    children,
    menuLabelClassName,
    menuLabelOpenClassName,
    onToggleActive,
  } = props;
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof onToggleActive === "function") {
      onToggleActive();
    }
    // Don't show focus outline if user just clicked the element with mouse
    // tab + enter creates also a click event, but its location is origin.
    const nativeEvent = e.nativeEvent;
    const isRealClick = !(
      nativeEvent.clientX === 0 && nativeEvent.clientY === 0
    );
    if (isRealClick) {
      setIsClicked(true);
    }
  };

  const handleBlur = () => {
    setIsClicked(false);
  };

  const buttonClass = classNames(css.menuLabelBtn, menuLabelClassName, {
    [css.btnClicked]: isClicked,
    [css.isOpen]: isOpen,
    [menuLabelOpenClassName as string]: !!(isOpen && menuLabelOpenClassName),
  });

  return (
    <button
      className={buttonClass}
      onClick={handleClick}
      onBlur={handleBlur}
      type='button'>
      {children}
    </button>
  );
}

export default MenuLabel;
