import React from "react";
import { AppDispatch, AppSelect } from "@src/hooks";
import { fetchProducts } from "./ProductsPageSlice";
import { customConnect } from "@src/components/helperComponents/customConnect";
import css from "./ProductsPage.module.css";
import { ProductType } from "../pageGlobalType";
import { Error, Loader, NamedLink, Success } from "@src/components";
import { IntlShape } from "react-intl";
import Page from "@src/components/Page/Page";
import RightChild from "@src/components/RIghtChild/RightChild";
import { FetchStatusVal } from "@src/util/fetchStatusHelper";
import { GeneralError } from "@src/util/APITypes";

type ProductsPagePropsType = {
  status: FetchStatusVal;
  products: ProductType[];
  onFetchProducts: Function;
  intl: IntlShape;
  name: string;
  error: GeneralError;
};

function ProductsPage(props: ProductsPagePropsType) {
  const { status, products, intl, error } = props;
  const description = intl.formatMessage({ id: "Homepage.description" });
  const title = intl.formatMessage({ id: "ProductsPage.title" });
  return (
    <Page
      metaTitle={title}
      description={description}
      contentRootClassName={css.root}>
      <RightChild>
        <Loader status={status} />
        <Success status={status}>
          {products && products.length > 0 ? (
            <ul>
              <li>
                <h3>Products:</h3>
              </li>
              {products.map((product) => (
                <li key={product.id}>
                  <span>{product.title}</span>
                  <NamedLink
                    name={"ProductPage"}
                    routeParams={{ id: product.id }}>
                    See More
                  </NamedLink>
                </li>
              ))}
            </ul>
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

const mapToStateProps = (select: AppSelect) => {
  const state = select({
    status: "products.status",
    error: "products.error",
    products: "products.products",
  });
  return state;
};

const mapToDispatchProps = (dispatch: AppDispatch) => ({
  onFetchProducts: () => dispatch(fetchProducts()),
});

export default customConnect(mapToStateProps, mapToDispatchProps)(ProductsPage);
