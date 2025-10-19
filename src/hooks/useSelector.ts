import { RootStateType } from "@src/store";
import { useAppSelector } from "./useReduxHooks";
import { shallowEqual } from "react-redux";

const getNestedData = (state: any, names: string[], index = 0): any => {
  let name = names[index];
  const nextValue = state == null ? undefined : state[name];
  if (index === names.length - 1) {
    return nextValue;
  }
  return getNestedData(nextValue, names, index + 1);
};

const getStateData =
  (names: Record<string, string>) => (state: RootStateType) => {
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
      [K in keyof T & string]: T[K] extends object
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

type ValidPath = NestedPaths<RootStateType>;

export function useSelector<T extends Record<string, ValidPath>>(
  nameRef: T
): { [P in keyof T]: NestedValue<RootStateType, T[P]> } {
  return useAppSelector(getStateData(nameRef), shallowEqual) as any;
}

type N<T> = T extends object
  ? {
      [K in keyof T & string]: K | `${K}.${N<T[K]>}`;
    }[keyof T & string]
  : never;

type V = N<RootStateType>;
