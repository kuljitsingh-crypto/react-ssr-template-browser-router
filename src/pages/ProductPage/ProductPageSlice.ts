import { createSlice } from "@reduxjs/toolkit";
import { FETCH_STATUS, FetchStatusVal } from "@src/custom-config";
import { RootStateType } from "@src/store";
import { customCreateAsyncThunk } from "@src/storeHelperFunction";
import { Params } from "react-router-dom";
import { UseDispatchType, UseGetStateType } from "@src/hooks";
import { ProductErrorType, ProductType } from "../pageGlobalType";

type ProductStateType = {
  status: FetchStatusVal;
  product: ProductType | null;
  error?: ProductErrorType | null;
};

const PRODUCT_FETCH_NAME = "product/fetchproductbyid";

const initialState: ProductStateType = {
  status: FETCH_STATUS.idle,
  product: null,
  error: undefined,
};

export const fetchProduct = customCreateAsyncThunk<
  ProductType,
  string | undefined
>(
  PRODUCT_FETCH_NAME,
  async (productId, { extra: { axios, config } }) => {
    if (!productId) {
      return;
    }

    const resp = await axios.get(
      `https://fakestoreapi.in/api/products/${productId}`
    );

    return resp.data.product;
  },
  {
    condition: (productId, { getState }) => {
      const {
        product: { product },
      } = getState();

      const shouldFetchProduct =
        !product ||
        (product && !!productId && product.id.toString() !== productId);
      return shouldFetchProduct;
    },
  }
);

export const productPageSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state, action) => {
        state.status = FETCH_STATUS.loading;
        state.product = null;
        state.error = undefined;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        if (
          state.status === FETCH_STATUS.idle ||
          state.status === FETCH_STATUS.loading
        ) {
          state.status = FETCH_STATUS.succeeded;
          state.product = action.payload;
        }
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        const { code, name, message } = action.error;
        state.status = FETCH_STATUS.failed;
        state.error = { code, name, message };
      });
  },
});
export const selectProductStatus = (state: RootStateType) =>
  state.product.status;
export const selectProduct = (state: RootStateType) => state.product.product;
export const selectProductError = (state: RootStateType) => state.product.error;

export default productPageSlice.reducer;

export const loadData = (
  getState: UseGetStateType,
  dispatch: UseDispatchType,
  params: Params,
  search?: string
) => {
  console.log(search, params, getState(), dispatch);
  const { id } = params;
  return dispatch(fetchProduct(id));
};
