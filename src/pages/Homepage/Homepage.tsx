import React from "react";
import { UseDispatchType, UseSelectorType } from "@src/hooks";
import { incrementCount, selectCount, incrementCountBy } from "./homePageSlice";
import { customConnect } from "@src/components/helperComponents/customConnect";
import Page from "@src/components/Page/Page";
import { IntlShape } from "react-intl";
import LeftChild from "@src/components/LeftChild/LeftChild";
import RightChild from "@src/components/RIghtChild/RightChild";
import { NamedLink } from "@src/components";

interface HomepagePropsType {
  count: number;
  onIncrementCount: Function;
  onIncrementCountBy: Function;
  dispatch: Function;
  intl: IntlShape;
}

function HomepageComponent(props: HomepagePropsType): React.JSX.Element {
  const { intl } = props;
  const description = intl.formatMessage({ id: "Homepage.description" });
  const title = intl.formatMessage({ id: "Homepage.title" });

  return (
    // This is important
    // Wrap your route component with the Page component.
    // The Page component injects various meta tags related to SEO and other common meta tags.
    // Want to know which props pass to the Page component, see Page.tsx for details

    <Page description={description} metaTitle={title}>
      <LeftChild />
      <RightChild>
        <NamedLink name='ProductsPage'>Products</NamedLink>
      </RightChild>
    </Page>
  );
}
const customMapToState = (selector: UseSelectorType) => {
  const count = selector(selectCount);
  return { count };
};
const customMapToDispatch = (dispatch: UseDispatchType) => {
  return {
    onIncrementCount: () => dispatch(incrementCount()),
    onIncrementCountBy: (value: number) => dispatch(incrementCountBy(value)),
    dispatch,
  };
};

export default customConnect(
  customMapToState,
  customMapToDispatch
)(HomepageComponent);
