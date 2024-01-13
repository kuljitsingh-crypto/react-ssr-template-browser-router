import homePageReducer from "./pages/Homepage/homePageSlice";
import productsReducer from "./pages/ProductsPage/ProductsPageSlice";
import productReducer from "./pages/ProductPage/ProductPageSlice";

export const reducers = {
  home: homePageReducer,
  products: productsReducer,
  product: productReducer,
};
