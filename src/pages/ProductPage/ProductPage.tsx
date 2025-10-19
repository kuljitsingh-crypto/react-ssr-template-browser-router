import React from "react";
import { UseDispatchType, UseSelectorType } from "@src/hooks";
import { fetchProduct } from "./ProductPageSlice";
import { customConnect } from "@src/components/helperComponents/customConnect";
import css from "./ProductPage.module.css";
import { ProductType } from "../pageGlobalType";
import { IntlShape } from "react-intl";
import Page from "@src/components/Page/Page";
import RightChild from "@src/components/RIghtChild/RightChild";
import { selectStateValue } from "@src/storeHelperFunction";
import { FetchStatusVal } from "@src/util/fetchStatusHelper";
import { GeneralError } from "@src/util/APITypes";
import { Error, Loader, Success } from "@src/components";

type ProductPagePropsType = {
  status: FetchStatusVal;
  product: ProductType | null;
  onFetchProduct: Function;
  error: GeneralError | null;
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
        <Loader status={status} />
        <Success status={status}>
          {product ? (
            <div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <img alt={product.title} src={product.image} />
            </div>
          ) : null}
        </Success>
        <Error
          status={status}
          error={error}
          errorMsg={intl.formatMessage({ id: "ProductsPage.loadFailed" })}
        />
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
