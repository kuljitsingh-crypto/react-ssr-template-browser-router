import React from "react";
import loadable from "@loadable/component";
import { routesName } from "./routesHelperFunction";
import NamedRedirect from "../components/NamedRedirect/NamedRedirect";
import { getPageDataLoadingAPI } from "../pages/pageDataLoadingAPI";

const HomePage = loadable(() =>
  import(/*webpackChunkName:"HomePage"*/ "../pages/Homepage/Homepage")
);
const AboutPage = loadable(() =>
  import(/*webpackChunkName:"AboutPage"*/ "../pages/About/About")
);
const ProductsPage = loadable(() =>
  import(
    /*webpackChunkName:"ProductsPage"*/ "../pages/ProductsPage/ProductsPage"
  )
);
const ProductPage = loadable(() =>
  import(/*webpackChunkName:"ProductPage"*/ "../pages/ProductPage/ProductPage")
);
const NoFoundPage = loadable(() =>
  import(/*webpackChunkName:"NoFoundPage"*/ "../pages/NoFoundPage/NoFoundPage")
);

const pageDataLoadingAPI = getPageDataLoadingAPI();

export const routes = [
  {
    path: "/",
    element: <HomePage />,
    name: routesName.Homepage,
    exact: true,
  },
  {
    path: "/about",
    element: <AboutPage />,
    name: routesName.Aboutpage,
    exact: true,
  },
  {
    path: "/products",
    element: <ProductsPage />,
    name: routesName.ProductsPage,
    exact: true,
    loadData: pageDataLoadingAPI.ProductsPage,
  },
  {
    path: "/products/:id",
    element: <ProductPage />,
    name: routesName.ProductPage,
    exact: true,
    loadData: pageDataLoadingAPI.ProductPage,
  },
  {
    path: "/home",
    element: <NamedRedirect name={routesName.Homepage} />,
    name: routesName.Homepage,
    exact: true,
  },
  {
    path: "*",
    element: <NoFoundPage />,
    name: routesName.NotFoundPage,
    exact: true,
  },
];
