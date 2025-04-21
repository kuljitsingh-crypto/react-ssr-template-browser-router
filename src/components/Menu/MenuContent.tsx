import React from "react";
import MenuItem from "./MenuItem";
import classNames from "classnames";
import css from "./Menu.module.css";

type MenuContentProps = {
  contentClassname?: string;
  menuContentOpenClassname?: string;
  menuContentULClassname?: string;
  isOpen?: boolean;
  children: React.ReactNode;
  menuContentRef?: React.MutableRefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
};
function MenuContent(props: MenuContentProps) {
  const {
    isOpen,
    children,
    contentClassname,
    menuContentOpenClassname,
    menuContentULClassname,
    menuContentRef,
    style,
  } = props;

  React.Children.forEach(children, (child: any) => {
    if (child.type !== MenuItem) {
      throw new Error("All children of MenuContent must be MenuItems.");
    }
    if (child.key == null) {
      throw new Error('All children of MenuContent must have a "key" prop.');
    }
  });
  const contentClassName = classNames(css.menuContent, contentClassname, {
    [css.menuContentOpen]: isOpen,
    [menuContentOpenClassname as string]: isOpen && menuContentOpenClassname,
  });

  const contentUlClassName = classNames(
    css.menuContentUl,
    menuContentULClassname
  );

  const refCallback = (e: HTMLDivElement | null) => {
    if (menuContentRef) {
      menuContentRef.current = e;
    }
  };

  return (
    <div className={contentClassName} ref={refCallback} style={style}>
      <ul className={contentUlClassName}>{children}</ul>
    </div>
  );
}

export default MenuContent;
