import React from "react";
import { IntlShape, useIntl } from "react-intl";
import {
  useAppDispatch,
  AppDispatch,
  AppSelect,
  useAppSelect,
} from "@src/hooks";

type MapToStateFuncType<T> = ((select: AppSelect) => T) | null;

type MapToDisPatchFuncType<T> = ((dispatch: AppDispatch) => T) | null;

export function customConnect<
  StateProps extends Record<string, any> = Record<string, any>,
  DispatchProps extends Record<string, any> = Record<string, any>
>(
  mapToStateFunc?: MapToStateFuncType<StateProps>,
  mapToDisPatchFunc?: MapToDisPatchFuncType<DispatchProps>
) {
  return function upperWrapperComponent<
    T extends Record<string, any> = Record<string, any>
  >(
    Component: React.JSXElementConstructor<
      StateProps & DispatchProps & { intl: IntlShape } & T
    >
  ) {
    return function WrapperComponent(props: T) {
      const dispatch = useAppDispatch();
      const intl = useIntl();
      const componentState =
        typeof mapToStateFunc === "function"
          ? mapToStateFunc(useAppSelect)
          : {};

      const componentDispatchFunction =
        typeof mapToDisPatchFunc === "function"
          ? mapToDisPatchFunc(dispatch)
          : {};

      // Correctly merge props
      const mergedProps = {
        ...props,
        ...componentState,
        ...componentDispatchFunction,
        intl,
      } as StateProps & DispatchProps & T & { intl: IntlShape };
      return <Component {...mergedProps} />;
    };
  };
}
