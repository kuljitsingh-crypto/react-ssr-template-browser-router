import { createSlice } from "@reduxjs/toolkit";
import { FETCH_STATUS } from "../../custom-config";
import { RootStateType } from "../../store";
import { customCreateAsyncThunk } from "../../storeHelperFunction";
import { Params } from "react-router-dom";
import { UseDispatchType } from "../../hooks";
import { ProductErrorType, ProductType } from "../pageGlobalType";

type ProductStateType = {
  status: (typeof FETCH_STATUS)[keyof typeof FETCH_STATUS];
  products: ProductType[];
  error?: ProductErrorType | null;
};

const PRODUCTS_FETCH_NAME = "products/fetchproducts";

const initalState: ProductStateType = {
  status: FETCH_STATUS.idle,
  products: [],
  error: undefined,
};

export const fetchProducts = customCreateAsyncThunk<ProductType[]>(
  PRODUCTS_FETCH_NAME,
  async (_, { extra: axios }) => {
    const resp = await axios.get("https://fakestoreapi.com/products");
    return resp.data;
  },
  {
    condition: (_, { getState }) => {
      const state = getState();
      const {
        products: { products },
      } = state;
      return products.length <= 0;
    },
  }
);

export const productsPageSlice = createSlice({
  name: "products",
  initialState: initalState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = FETCH_STATUS.loading;
        state.products = [];
        state.error = undefined;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (
          state.status === FETCH_STATUS.idle ||
          state.status === FETCH_STATUS.loading
        ) {
          state.status = FETCH_STATUS.succeeded;
          state.products.push(...action.payload);
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        const { code, name, message } = action.error;
        state.status = FETCH_STATUS.failed;
        state.error = { code, name, message };
      });
  },
});
export const selectProductsStatus = (state: RootStateType) =>
  state.products.status;
export const selectProducts = (state: RootStateType) => state.products.products;
export const selectProductsError = (state: RootStateType) =>
  state.products.error;

export default productsPageSlice.reducer;

export const loadData = (
  dispatch: UseDispatchType,
  params: Params,
  search?: string
) => {
  return dispatch(fetchProducts());
};
