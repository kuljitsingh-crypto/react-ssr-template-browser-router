import React, { useState } from "react";
import { Menu, MenuContent, MenuItem, MenuLabel } from "../Menu";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { GrSystem } from "react-icons/gr";
import css from "./Topbar.module.css";
import { appTheme, Theme } from "@src/custom-config";
import classNames from "classnames";

type ThemeMenuProps = {
  theme: Theme;
  onChangeTheme: (theme: Theme) => void;
};

function ThemeMenu(props: ThemeMenuProps) {
  const { theme, onChangeTheme } = props;
  const [isOpen, setIsOpen] = useState(false);

  const onToggleOpen = (state: boolean | null | undefined) => {
    setIsOpen(!!state);
  };

  const handleClick = (theme: Theme) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    onChangeTheme(theme);
    onToggleOpen(false);
  };

  return (
    <Menu isOpen={isOpen} onToggleActive={onToggleOpen}>
      <MenuLabel menuLabelClassName={css.menuLabelBtn}>
        {theme === "light" ? (
          <MdOutlineLightMode className={css.themIcon} />
        ) : theme === "dark" ? (
          <MdOutlineDarkMode className={css.themIcon} />
        ) : (
          <GrSystem className={css.themIcon} />
        )}
      </MenuLabel>
      <MenuContent menuContentULClassname={css.themeContentUl}>
        <MenuItem key={appTheme.light}>
          <button
            type='button'
            className={classNames(css.themeItem, {
              [css.themeItemSelected]: theme === appTheme.light,
            })}
            onClick={handleClick(appTheme.light)}>
            <MdOutlineLightMode />
            <span>{appTheme.light}</span>
          </button>
        </MenuItem>
        <MenuItem key={appTheme.dark}>
          <button
            type='button'
            className={classNames(css.themeItem, {
              [css.themeItemSelected]: theme === appTheme.dark,
            })}
            onClick={handleClick(appTheme.dark)}>
            <MdOutlineDarkMode />
            <span>{appTheme.dark}</span>
          </button>
        </MenuItem>
        <MenuItem key={appTheme.system}>
          <button
            type='button'
            className={classNames(css.themeItem, {
              [css.themeItemSelected]: theme === appTheme.system,
            })}
            onClick={handleClick(appTheme.system)}>
            <GrSystem className={css.themIcon} />
            <span>{appTheme.system}</span>
          </button>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}

export default ThemeMenu;
