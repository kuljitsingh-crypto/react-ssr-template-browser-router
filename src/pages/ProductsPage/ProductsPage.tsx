import React from "react";
import { UseDispatchType, UseSelectorType } from "@src/hooks";
import { fetchProducts } from "./ProductsPageSlice";
import { customConnect } from "@src/components/helperComponents/customConnect";
import { fetchStatus, FetchStatusVal } from "@src/custom-config";
import css from "./ProductsPage.module.css";
import { ProductErrorType, ProductType } from "../pageGlobalType";
import { NamedLink } from "@src/components";
import { IntlShape } from "react-intl";
import Page from "@src/components/Page/Page";
import RightChild from "@src/components/RIghtChild/RightChild";
import { routesName } from "@src/routeNames";
import { selectStateValue } from "@src/storeHelperFunction";

type ProductsPagePropsType = {
  status: FetchStatusVal;
  products: ProductType[];
  onFetchProducts: Function;
  intl: IntlShape;
  name: string;
  error?: ProductErrorType;
};

function ProductsPage(props: ProductsPagePropsType) {
  const { status, products, intl } = props;
  const description = intl.formatMessage({ id: "Homepage.description" });
  const title = intl.formatMessage({ id: "ProductsPage.title" });
  return (
    <Page
      metaTitle={title}
      description={description}
      contentRootClassName={css.root}>
      <RightChild>
        {fetchStatus.isLoading(status) ? (
          <span>Loading products...</span>
        ) : null}
        {fetchStatus.isSucceeded(status) && products && products.length > 0 ? (
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
        {fetchStatus.isFailed(status) ? (
          <p className={css.error}>Failed to get products. Please try again.</p>
        ) : null}
      </RightChild>
    </Page>
  );
}

const mapToStateProps = (selector: UseSelectorType) => {
  const status = selector(selectStateValue("products", "status"));
  const products = selector(selectStateValue("products", "products"));
  const error = selector(selectStateValue("products", "error"));
  return { status, products, error };
};

const mapToDispatchProps = (dispatch: UseDispatchType) => ({
  onFetchProducts: () => dispatch(fetchProducts()),
});

export default customConnect(mapToStateProps, mapToDispatchProps)(ProductsPage);
