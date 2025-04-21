import React, { useRef } from "react";
import classNames from "classnames";
import css from "./Button.module.css";
import IconSpinner from "../../IconSpinner/IconSpinner";
import { rippleAnimationDuration } from "@src/custom-config";

type ButtonProps = {
  type: "submit" | "reset" | "button";
  title?: string;
  children?: React.JSX.Element;
  buttonClassName?: string;
  titleClassName?: string;
  iconClassName?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Button = (props: ButtonProps) => {
  const {
    title,
    children,
    type,
    buttonClassName,
    titleClassName,
    iconClassName,
    isLoading,
    disabled,
    onClick,
  } = props;
  const rippleContainerRef = useRef<HTMLSpanElement | null>(null);
  if (!title && !children) {
    throw new Error("PrimaryButton requires either a title or children prop");
  }
  const buttonChildren = title ? (
    <span className={classNames(css.btnText, titleClassName)}>{title}</span>
  ) : (
    children
  );

  const addRippleOnClick = (e: MouseEvent) => {
    if (rippleContainerRef.current) {
      const targetElement = e.target as HTMLButtonElement;
      const diameter = Math.max(
        targetElement.clientWidth,
        targetElement.clientHeight
      );
      const radius = diameter / 2;
      const left = `${e.clientX - targetElement.offsetLeft - radius}px`;
      const top = `${e.clientY - targetElement.offsetTop - radius}px`;
      rippleContainerRef.current.setAttribute(
        "style",
        `top:${top};left:${left};width:${diameter}px;height:${diameter}px`
      );
      rippleContainerRef.current.classList.add("ripple");
      removeRippleClass();
    }
  };

  const handleClick = (e: MouseEvent) => {
    if (type === "button") {
      e.preventDefault();
    }
    if (typeof onClick === "function") {
      onClick();
    }
    addRippleOnClick(e);
  };

  const removeRippleClass = () => {
    setTimeout(() => {
      rippleContainerRef.current?.classList.remove("ripple");
    }, rippleAnimationDuration);
  };

  const rippleRefCallback = (e: HTMLSpanElement | null) => {
    if (e && rippleContainerRef.current !== e) {
      const bgColor = e.parentElement
        ? window.getComputedStyle(e.parentElement).color
        : "";
      e.style.backgroundColor = bgColor;
    }
    rippleContainerRef.current = e;
  };

  return (
    <button
      disabled={disabled}
      type={type}
      className={classNames(css.button, buttonClassName, {
        [css.disabledBtn]: disabled,
      })}
      onClick={handleClick as any}>
      {isLoading ? (
        <IconSpinner
          className={classNames(css.buttonLoadingIcon, iconClassName)}
        />
      ) : (
        buttonChildren
      )}
      <span ref={rippleRefCallback} className={css.btnRipple} />
    </button>
  );
};

export const PrimaryButton = (props: ButtonProps) => {
  const { buttonClassName, titleClassName, ...rest } = props;
  const buttonClasses = classNames(css.primaryBtn, buttonClassName);
  const titleClasses = classNames(css.primaryBtnText, titleClassName);
  return (
    <Button
      {...rest}
      buttonClassName={buttonClasses}
      titleClassName={titleClasses}
    />
  );
};

export const SecondaryButton = (props: ButtonProps) => {
  const { buttonClassName, titleClassName, ...rest } = props;
  const buttonClasses = classNames(css.secondaryBtn, buttonClassName);
  const titleClasses = classNames(css.secondaryBtnText, titleClassName);
  return (
    <Button
      {...rest}
      buttonClassName={buttonClasses}
      titleClassName={titleClasses}
    />
  );
};

export const InlineTextButton = (props: ButtonProps) => {
  const { buttonClassName, titleClassName, ...rest } = props;
  const buttonClasses = classNames(css.inlineTextBtn, buttonClassName);
  const titleClasses = classNames(css.inlineTextBtnText, titleClassName);
  return (
    <Button
      {...rest}
      buttonClassName={buttonClasses}
      titleClassName={titleClasses}
    />
  );
};
