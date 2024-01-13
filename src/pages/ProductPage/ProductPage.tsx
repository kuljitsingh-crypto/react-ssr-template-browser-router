import React from "react";
import { UseDispatchType, UseSelectorType } from "../../hooks";
import {
  fetchProduct,
  selectProduct,
  selectProductError,
  selectProductStatus,
} from "./ProductPageSlice";
import { stateAndDispatchWrapper } from "../../components/helperComponents/stateAndDispatchWrapper";
import { FETCH_STATUS } from "../../custom-config";
import css from "./ProductPage.module.css";
import { ProductErrorType, ProductType } from "../pageGlobalType";
import { IntlShape } from "react-intl";
import Page from "../../components/helperComponents/Page";

type ProductPagePropsType = {
  status: (typeof FETCH_STATUS)[keyof typeof FETCH_STATUS];
  product: ProductType | null;
  onFetchProduct: Function;
  error?: ProductErrorType | null;
  intl: IntlShape;
};

function ProductPage(props: ProductPagePropsType) {
  const { status, product, error, intl } = props;
  const description = intl.formatMessage({ id: "Homepage.description" });
  const title = intl.formatMessage({ id: "ProductPage.title" });

  return (
    <Page description={description} metaTitle={title}>
      <div className={css.root}>
        {status === FETCH_STATUS.loading ? (
          <span>Loading product...</span>
        ) : null}
        {status === FETCH_STATUS.succeeded && product ? (
          <div>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
          </div>
        ) : null}
        {status === FETCH_STATUS.failed && !!error ? (
          <p className={css.error}>Failed to get product. Please try again.</p>
        ) : null}
      </div>
    </Page>
  );
}

const mapToStateProps = (selector: UseSelectorType) => {
  const status = selector(selectProductStatus);
  const product = selector(selectProduct);
  const error = selector(selectProductError);
  return { status, product, error };
};

const mapToDispatchProps = (dispatch: UseDispatchType) => ({
  onFetchProduct: (id: string | undefined) => dispatch(fetchProduct(id)),
});

export default stateAndDispatchWrapper(
  ProductPage,
  mapToStateProps,
  mapToDispatchProps
);
