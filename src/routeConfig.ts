// Add routes the you want to in your website keep the name of routes same as Component file name in Pages
// For example if your component file name in pages as like pages/ResourcePage/ResourcePage
// then route name has to be ResourcePage in route details

import { loadData as productsPageLoader } from "@src/pages/ProductsPage/ProductsPageSlice";
import { loadData as productPageLoader } from "@src/pages/ProductPage/ProductPageSlice";
import { ConfigurationType } from "./custom-config";

export const routeConfiguration = (config: ConfigurationType) => {
  /// Based On Config your custom custom routing logic
  return [
    { path: "/", name: "Homepage" },
    {
      path: "/products",
      name: "ProductsPage",
      isAuth: true,
      loadData: productsPageLoader,
    },
    {
      path: "/products/:id",
      name: "ProductPage",
      isAuth: true,
      loadData: productPageLoader,
    },
    { path: "/login", name: "LoginPage" },
    { path: "/signup", name: "SignupPage" },
    { path: "/recover-password", name: "ForgotPassword" },
    { path: "*", name: "NotFoundPage", notFound: true },
  ] as const;
};

export type RouteNames = ReturnType<typeof routeConfiguration>[number]["name"];
