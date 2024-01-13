import React from "react";
import {
  UseDispatchType,
  UseSelectorType,
  useAppDispatch,
  useAppSelector,
} from "../../hooks";
import { useIntl } from "react-intl";

type MapToStateFuncType =
  | ((selector: UseSelectorType) => Record<string, any>)
  | null;

type MapToDisPatchFuncType =
  | ((dispatch: UseDispatchType) => Record<string, Function>)
  | null;

export function stateAndDispatchWrapper<T>(
  Component: React.JSXElementConstructor<T>,
  mapToStateFunc?: MapToStateFuncType,
  mapToDisPatchFunc?: MapToDisPatchFuncType
) {
  return function WrapperCompoent(props: T) {
    const dispatch = useAppDispatch();
    const intl = useIntl();
    const componentState =
      typeof mapToStateFunc === "function"
        ? mapToStateFunc(useAppSelector)
        : {};

    const componentDisaptchFunction =
      typeof mapToDisPatchFunc === "function"
        ? mapToDisPatchFunc(dispatch)
        : {};
    return (
      <Component
        {...props}
        {...componentState}
        {...componentDisaptchFunction}
        intl={intl}
      />
    );
  };
}
