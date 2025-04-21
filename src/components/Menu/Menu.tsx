import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import MenuLabel from "./MenuLabel";
import MenuContent from "./MenuContent";
import css from "./Menu.module.css";
import { useScreenDimension } from "../Page/pageHooks";

const MAX_MOBILE_WIDTH = 575; // 575px
const KEY_CODE_ESCAPE = 27;

type MenuProps = {
  className?: string;
  isOpen?: boolean;
  children?: React.ReactNode;
  contentPlacement?: "left" | "right";
  contentPlacementOffset?: number;
  preferScreenWidthOnMobile?: boolean;
  onToggleActive?: (enforcesState?: boolean | null) => void;
};

function MenuComp(props: MenuProps) {
  const {
    contentPlacement = "left",
    contentPlacementOffset,
    className,
    children,
    isOpen: isPropOpen,
    preferScreenWidthOnMobile,
    onToggleActive: onPropToggleOpen,
  } = props;
  const [isOpen, setIsOpen] = useState(isPropOpen ?? false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuContentRef = useRef<HTMLDivElement | null>(null);
  const { width } = useScreenDimension();

  const onToggleActive = (enforcesState?: boolean) => {
    const isOpen =
      typeof enforcesState === "boolean" ? enforcesState : !isPropOpen;
    if (typeof onPropToggleOpen === "function") {
      onPropToggleOpen(isOpen);
    } else {
      setIsOpen((isOpn) => (typeof isPropOpen === "boolean" ? isOpen : !isOpn));
    }
  };

  const handleBlur = (e: any) => {
    if (!menuRef.current?.contains(e.relatedTarget) && isOpen) {
      onToggleActive(false);
    }
  };

  const onKeyDown = (e: any) => {
    if (e.keyCode === KEY_CODE_ESCAPE && isOpen) {
      onToggleActive(false);
    }
  };

  const positionStyleForMenuContent = (
    position: "left" | "right",
    placementOffset = 0
  ) => {
    if (menuRef.current && menuContentRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const contentRect = menuContentRef.current.getBoundingClientRect();
      const contentWidth = contentRect.width;
      const effectiveContentWidth =
        position === "left"
          ? contentWidth + menuRect.left
          : contentWidth + menuRect.left - menuRect.width;

      if (width <= MAX_MOBILE_WIDTH && preferScreenWidthOnMobile) {
        return {
          left: -1 * (menuRect.left - 24),
          width: "calc(100vw - 48px)",
        };
      }
      const contentToRight =
        (contentPlacement === "left" && effectiveContentWidth > width) ||
        (contentPlacement === "right" && effectiveContentWidth >= 0);

      const contentToLeft =
        (contentPlacement === "left" && effectiveContentWidth < width) ||
        (contentPlacement === "right" && effectiveContentWidth < 0);

      const offsetValue = placementOffset || 0;
      return contentToLeft
        ? { left: offsetValue, width: "auto", minWidth: "100%" }
        : contentToRight
        ? { right: offsetValue, width: "auto", minWidth: "100%" }
        : {};
    }
  };

  const prepareChildren = (children: React.ReactNode) => {
    if (React.Children.count(children) !== 2) {
      throw new Error(
        "Menu must have exactly two children: MenuLabel and MenuContent"
      );
    }
    return React.Children.map(children, (child) => {
      if (!child) {
        return null;
      }
      if ((child as any).type === MenuLabel) {
        return React.cloneElement(child as any, { isOpen, onToggleActive });
      } else if ((child as any).type === MenuContent) {
        const positionStyle = positionStyleForMenuContent(
          contentPlacement,
          contentPlacementOffset
        );
        return React.cloneElement(child as any, {
          isOpen,
          menuContentRef,
          style: { ...(child as any).props.style, ...positionStyle },
        });
      } else {
        throw new Error("Menu children must be MenuLabel and MenuContent");
      }
    });
  };

  const menuChildren = prepareChildren(children);

  useEffect(() => {
    if (typeof isPropOpen === "boolean") {
      setIsOpen(!!isPropOpen);
    }
  }, [isPropOpen]);
  const menuClasses = classNames(css.menu, className);
  return (
    <div
      className={menuClasses}
      ref={menuRef}
      tabIndex={0}
      onBlur={handleBlur}
      onKeyDown={onKeyDown}>
      {menuChildren as any}
    </div>
  );
}
const Menu = MenuComp;
export default Menu;
