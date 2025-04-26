import { createSlice } from "@reduxjs/toolkit";
import { FETCH_STATUS, fetchStatus, FetchStatusVal } from "@src/custom-config";
import { customCreateAsyncThunk } from "@src/storeHelperFunction";
import { DataLoaderFunction } from "@src/hooks";
import { ProductErrorType, ProductType } from "../pageGlobalType";

type ProductStateType = {
  status: FetchStatusVal;
  products: ProductType[];
  error?: ProductErrorType | null;
};

const PRODUCTS_FETCH_NAME = "products/fetchproducts";

const initialState: ProductStateType = {
  status: FETCH_STATUS.idle,
  products: [],
  error: undefined,
};

export const fetchProducts = customCreateAsyncThunk<ProductType[]>(
  PRODUCTS_FETCH_NAME,
  async (_, { extra: { axios } }) => {
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
  initialState: initialState,
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
          fetchStatus.isIdle(state.status) ||
          fetchStatus.isLoading(state.status)
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

export default productsPageSlice.reducer;

export const loadData: DataLoaderFunction = (
  getState,
  dispatch,
  params,
  search
) => {
  return dispatch(fetchProducts());
};
