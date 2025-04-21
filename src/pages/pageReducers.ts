import homePageReducer from "./Homepage/homePageSlice";
import productsReducer from "./ProductsPage/ProductsPageSlice";
import productReducer from "./ProductPage/ProductPageSlice";

export const pageReducer = {
  home: homePageReducer,
  products: productsReducer,
  product: productReducer,
};
