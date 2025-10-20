import { useDispatch } from "react-redux";
import { Dispatch, RootState } from "@src/store";
import { PayloadAction } from "@reduxjs/toolkit";
type AppDispatchFuncType = () => Dispatch;

//----------------------redux hooks --------------------------------
export const useAppDispatch: AppDispatchFuncType = useDispatch;
export type AppDispatch = ReturnType<typeof useAppDispatch>;
export type GetState = () => RootState;
export type DataLoaderFunction = <P = any>(params: {
  getState: GetState;
  dispatch: AppDispatch;
  params: Record<string, any>;
  search: Record<string, any>;
}) => Promise<PayloadAction<P> | PayloadAction<unknown> | any>;
