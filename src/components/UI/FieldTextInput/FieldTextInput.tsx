import {
  Controller,
  UseFormControl,
  UseFormElement,
  UseFormInputType,
  UseFormValidationField,
} from "rc-simple-hook-form";
import React, { ChangeEvent, useRef, useState } from "react";
import classNames from "classnames";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

import css from "./FieldTextInput.module.css";

type FieldTextInputType = Extract<
  UseFormInputType,
  "text" | "textarea" | "password"
>;

type FieldTextInputProps = {
  id: string;
  name: string;
  label: string;
  control: UseFormControl;
  type: FieldTextInputType;
  placeholder?: string;
  validations?: UseFormValidationField;
  disabled?: boolean;
  inputContainerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  invalidInputClassName?: string;
  onChange?: (e: ChangeEvent<UseFormElement>) => void;
};

function FieldTextInput(props: FieldTextInputProps) {
  const {
    id,
    name,
    label,
    control,
    type: initialInputType,
    validations,
    disabled,
    placeholder,
    inputClassName,
    inputContainerClassName,
    labelClassName,
    invalidInputClassName,
    onChange: propsOnChange,
  } = props;
  const [inputType, setInputType] =
    useState<FieldTextInputType>(initialInputType);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleTogglePwd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (initialInputType !== "password") return;
    setInputType((inputType) =>
      inputType === "password" ? "text" : "password"
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      type={inputType}
      rules={validations}
      disabled={disabled}
      controllerRef={inputRef}
      render={(renderProps) => {
        const {
          field: { onChange, type, value, disabled },
          fieldState: { invalid, error },
        } = renderProps;
        const handleOnChange = (e: ChangeEvent<UseFormElement>) => {
          onChange(e);
          if (typeof propsOnChange === "function") {
            propsOnChange(e);
          }
        };
        const isTextArea = type === "textarea";
        const isInitialPassword = initialInputType === "password";
        const isPassword = type === "password";
        return (
          <div className={classNames(css.textRoot, inputContainerClassName)}>
            <label
              htmlFor={id}
              className={classNames(labelClassName, {
                [css.invalidLabel]: invalid,
              })}>
              {label}
            </label>
            <div
              className={classNames(css.inputDiv, {
                [css.pwdInputDiv]: isInitialPassword,
              })}>
              {isTextArea ? (
                <textarea
                  {...renderProps.field}
                  onChange={handleOnChange}
                  className={classNames(
                    css.textInput,
                    css.textArea,
                    inputClassName,
                    {
                      [css.fieldTextInput]: !!value,
                      [css.disabledTextInput]: disabled,
                      [css.failedTextInput]: invalid,
                    }
                  )}
                  placeholder={placeholder}
                  id={id}
                />
              ) : (
                <input
                  {...renderProps.field}
                  onChange={handleOnChange}
                  className={classNames(css.textInput, inputClassName, {
                    [css.fieldTextInput]: !!value,
                    [css.disabledTextInput]: disabled,
                    [css.failedTextInput]: invalid,
                    [css.pwdTextInput]: isInitialPassword,
                  })}
                  placeholder={placeholder}
                  id={id}
                />
              )}
              {isInitialPassword ? (
                <div className={css.pwdButtonDiv}>
                  <button
                    className={css.togglePasswordBtn}
                    type='button'
                    onClick={handleTogglePwd}>
                    {isPassword ? (
                      <IoIosEyeOff size={24} className={css.pwdIcon} />
                    ) : (
                      <IoIosEye size={24} className={css.pwdIcon} />
                    )}
                  </button>
                </div>
              ) : null}
            </div>

            {invalid ? (
              <p
                className={classNames(css.invalidInput, invalidInputClassName)}>
                {error.map((err, index) => (
                  <span key={index} className={css.errMsg}>
                    {err}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        );
      }}
    />
  );
}

export default FieldTextInput;
