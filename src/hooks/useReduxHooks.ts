import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { AppDispatch, RootStateType } from "@src/store";
import { useSelector } from "react-redux";
import { Params } from "react-router-dom";
import { PayloadAction } from "@reduxjs/toolkit";
type AppDispatchFuncType = () => AppDispatch;

//----------------------redux hooks --------------------------------
export const useAppDispatch: AppDispatchFuncType = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;
export type UseSelectorType = typeof useAppSelector;
export type UseDispatchType = ReturnType<typeof useAppDispatch>;
export type UseGetStateType = () => RootStateType;
export type DataLoaderFunction = <P = any>(
  getState: UseGetStateType,
  dispatch: UseDispatchType,
  params: Params,
  search: Record<string, any>
) => Promise<PayloadAction<P> | PayloadAction<unknown> | any>;
