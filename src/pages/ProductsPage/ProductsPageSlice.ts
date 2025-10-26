import { createSlice } from "@reduxjs/toolkit";
import { customCreateAsyncThunk } from "@src/storeHelperFunction";
import { DataLoaderFunction } from "@src/hooks";
import { ProductType } from "../pageGlobalType";
import { FetchStatus, FetchStatusVal } from "@src/util/fetchStatusHelper";
import { GeneralError } from "@src/util/APITypes";

type ProductStateType = {
  status: FetchStatusVal;
  products: ProductType[];
  error: GeneralError | null;
};

const PRODUCTS_FETCH_NAME = "products/fetchproducts";

const initialState: ProductStateType = {
  status: new FetchStatus(),
  products: [],
  error: null,
};

export const fetchProducts = customCreateAsyncThunk<ProductType[]>(
  PRODUCTS_FETCH_NAME,
  async (_, { extra: { extApi } }) => {
    const resp = await extApi.get("https://fakestoreapi.com/products");
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
        state.status = FetchStatus.loading;
        state.products = [];
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (state.status.isIdle || state.status.isLoading) {
          state.status = FetchStatus.succeeded;
          state.products.push(...action.payload);
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        const { code, name, message } = action.error;
        state.status = FetchStatus.failed;
        state.error = { code, name, message };
      });
  },
});

export default productsPageSlice.reducer;

export const loadData: DataLoaderFunction = ({
  getState,
  dispatch,
  params,
  search,
}) => {
  return dispatch(fetchProducts());
};
