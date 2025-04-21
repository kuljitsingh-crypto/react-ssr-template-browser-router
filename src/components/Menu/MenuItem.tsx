import React from "react";

type MenuItemProps = {
  menuItemClassName?: string;

  children: React.ReactNode;
};
function MenuItem(props: MenuItemProps) {
  const { children, menuItemClassName } = props;

  return (
    <li role='menuitem' className={menuItemClassName}>
      {children}
    </li>
  );
}

export default MenuItem;
