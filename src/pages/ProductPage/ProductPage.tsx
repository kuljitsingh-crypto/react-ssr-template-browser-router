import React from "react";
import { UseDispatchType, UseSelectorType } from "@src/hooks";
import {
  fetchProduct,
  selectProduct,
  selectProductError,
  selectProductStatus,
} from "./ProductPageSlice";
import { customConnect } from "@src/components/helperComponents/customConnect";
import { FETCH_STATUS, FetchStatusVal } from "@src/custom-config";
import css from "./ProductPage.module.css";
import { ProductErrorType, ProductType } from "../pageGlobalType";
import { IntlShape } from "react-intl";
import Page from "@src/components/Page/Page";
import RightChild from "@src/components/RIghtChild/RightChild";

type ProductPagePropsType = {
  status: FetchStatusVal;
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
    <Page
      description={description}
      metaTitle={title}
      contentRootClassName={css.root}>
      <RightChild>
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
      </RightChild>
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

export default customConnect(mapToStateProps, mapToDispatchProps)(ProductPage);
