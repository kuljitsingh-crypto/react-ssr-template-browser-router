import React from "react";
import { UseDispatchType, UseSelectorType } from "@src/hooks";
import { fetchProduct } from "./ProductPageSlice";
import { customConnect } from "@src/components/helperComponents/customConnect";
import css from "./ProductPage.module.css";
import { ProductErrorType, ProductType } from "../pageGlobalType";
import { IntlShape } from "react-intl";
import Page from "@src/components/Page/Page";
import RightChild from "@src/components/RIghtChild/RightChild";
import { selectStateValue } from "@src/storeHelperFunction";
import { FetchStatusVal } from "@src/util/fetchStatusHelper";

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
        {status.isLoading ? <span>Loading product...</span> : null}
        {status.isSucceeded && product ? (
          <div>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <img alt={product.title} src={product.image} />
          </div>
        ) : null}
        {status.isFailed && !!error ? (
          <p className={css.error}>Failed to get product. Please try again.</p>
        ) : null}
      </RightChild>
    </Page>
  );
}

const mapToStateProps = (selector: UseSelectorType) => {
  const status = selector(selectStateValue("product", "status"));
  const product = selector(selectStateValue("product", "product"));
  const error = selector(selectStateValue("product", "error"));
  return { status, product, error };
};

const mapToDispatchProps = (dispatch: UseDispatchType) => ({
  onFetchProduct: (id: string | undefined) => dispatch(fetchProduct(id)),
});

export default customConnect(mapToStateProps, mapToDispatchProps)(ProductPage);
