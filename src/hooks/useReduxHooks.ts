import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { AppDispatch, RootStateType } from "@src/store";
import { useSelector } from "react-redux";
type AppDispatchFuncType = () => AppDispatch;

//----------------------redux hooks --------------------------------
export const useAppDispatch: AppDispatchFuncType = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;
export type UseSelectorType = typeof useAppSelector;
export type UseDispatchType = ReturnType<typeof useAppDispatch>;
export type UseGetStateType = () => RootStateType;
