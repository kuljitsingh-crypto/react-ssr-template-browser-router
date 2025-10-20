import { RootState } from "@src/store";
import { shallowEqual, useSelector as useReduxSelector } from "react-redux";

const getNestedData = (state: any, names: string[]): any => {
  return names.reduce(
    (acc, name) => (acc[name] == null ? undefined : acc[name]),
    state
  );
};

const getStateData = (names: Record<string, string>) => (state: RootState) => {
  const values: Record<string, any> = {};
  Object.entries(names).forEach(([key, path]) => {
    const keys = path.split(".");
    const val = getNestedData(state, keys);
    values[key] = val;
  });

  return values;
};

// Recursively get nested value type
type NestedPaths<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends (...args: any[]) => any
        ? never
        : T[K] extends object
        ? K | `${K}.${NestedPaths<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

// Get value type for a nested path string
type NestedValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? NestedValue<T[K], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;

type ValidPath = NestedPaths<RootState>;

export function useAppSelect<T extends Record<string, ValidPath>>(
  states: T
): { [P in keyof T]: NestedValue<RootState, T[P]> } {
  return useReduxSelector(getStateData(states), shallowEqual) as any;
}

export type AppSelect = typeof useAppSelect;
