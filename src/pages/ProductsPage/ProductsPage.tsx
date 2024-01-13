import React from "react";
import { UseDispatchType, UseSelectorType } from "../../hooks";
import {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "./ProductsPageSlice";
import { stateAndDispatchWrapper } from "../../components/helperComponents/stateAndDispatchWrapper";
import { FETCH_STATUS } from "../../custom-config";
import css from "./ProductsPage.module.css";
import { ProductErrorType, ProductType } from "../pageGlobalType";
import { NamedLink } from "../../components";
import { routesName } from "../../utill/routesHelperFunction";
import { IntlShape } from "react-intl";
import Page from "../../components/helperComponents/Page";

type ProductsPagePropsType = {
  status: (typeof FETCH_STATUS)[keyof typeof FETCH_STATUS];
  products: ProductType[];
  onFetchProducts: Function;
  intl: IntlShape;
  error?: ProductErrorType;
};

function ProductsPage(props: ProductsPagePropsType) {
  const { status, products, intl } = props;
  const description = intl.formatMessage({ id: "Homepage.description" });
  const title = intl.formatMessage({ id: "ProductsPage.title" });
  return (
    <Page metaTitle={title} description={description}>
      <div className={css.root}>
        {status === FETCH_STATUS.loading ? (
          <span>Loading products...</span>
        ) : null}
        {status === FETCH_STATUS.succeeded &&
        products &&
        products.length > 0 ? (
          <ul>
            <li>
              <h3>Products:</h3>
            </li>
            {products.map((product) => (
              <li key={product.id}>
                <span>{product.title}</span>
                <NamedLink
                  name={routesName.ProductPage}
                  routeParams={{ id: product.id }}>
                  See More
                </NamedLink>
              </li>
            ))}
          </ul>
        ) : null}
        {status === FETCH_STATUS.failed ? (
          <p className={css.error}>Failed to get products. Please try again.</p>
        ) : null}
      </div>
    </Page>
  );
}

const mapToStateProps = (selector: UseSelectorType) => {
  const status = selector(selectProductsStatus);
  const products = selector(selectProducts);
  const error = selector(selectProductsError);
  return { status, products, error };
};

const mapToDispatchProps = (dispatch: UseDispatchType) => ({
  onFetchProducts: () => dispatch(fetchProducts()),
});

export default stateAndDispatchWrapper(
  ProductsPage,
  mapToStateProps,
  mapToDispatchProps
);
