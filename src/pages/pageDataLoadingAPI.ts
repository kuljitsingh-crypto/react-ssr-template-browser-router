import { routesName } from "@src/routeNames";
import { loadData as productsPageLoader } from "./ProductsPage/ProductsPageSlice";
import { loadData as productPageLoader } from "./ProductPage/ProductPageSlice";

export const getPageDataLoadingAPI = () => ({
  [routesName.ProductsPage]: productsPageLoader,
  [routesName.ProductPage]: productPageLoader,
});
