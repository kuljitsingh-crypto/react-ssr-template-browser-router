import { createSlice } from "@reduxjs/toolkit";
import { customCreateAsyncThunk } from "@src/storeHelperFunction";
import { DataLoaderFunction } from "@src/hooks";
import { ProductType } from "../pageGlobalType";
import { FetchStatus, FetchStatusVal } from "@src/util/fetchStatusHelper";
import { GeneralError } from "@src/util/APITypes";

type ProductStateType = {
  status: FetchStatusVal;
  product: ProductType | null;
  error: GeneralError | null;
};

const PRODUCT_FETCH_NAME = "product/fetchproductbyid";

const initialState: ProductStateType = {
  status: new FetchStatus(),
  product: null,
  error: null,
};

export const fetchProduct = customCreateAsyncThunk<
  ProductType,
  string | undefined
>(
  PRODUCT_FETCH_NAME,
  async (productId, { extra: { extApi, config } }) => {
    if (!productId) {
      return;
    }
    const url = `https://fakestoreapi.com/products/${productId}`;
    const resp = await extApi.get(url);

    return resp.data;
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
        state.status = FetchStatus.loading;
        state.product = null;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        if (state.status.isIdle || state.status.isLoading) {
          state.status = FetchStatus.succeeded;
          state.product = action.payload;
        }
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        const { code, name, message } = action.error;
        state.status = FetchStatus.failed;
        state.error = { code, name, message };
      });
  },
});

export default productPageSlice.reducer;

export const loadData: DataLoaderFunction = ({
  getState,
  dispatch,
  params,
  search,
}) => {
  const { id } = params;
  return dispatch(fetchProduct(id));
};
