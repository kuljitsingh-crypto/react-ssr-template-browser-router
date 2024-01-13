import React, { useState } from "react";
import { NamedLink } from "../../components";
import { routesName } from "../../utill/routesHelperFunction";
import { UseDispatchType, UseSelectorType } from "../../hooks";
import { incrementCount, selectCount, incrementCountBy } from "./homePageSlice";
import { stateAndDispatchWrapper } from "../../components/helperComponents/stateAndDispatchWrapper";
import Page from "../../components/helperComponents/Page";
import { IntlShape } from "react-intl";

interface HomepagePropsType {
  count: number;
  onIncrementCount: Function;
  onIncrementCountBy: Function;
  dispatch: Function;
  intl: IntlShape;
}

function HomepageComponent(props: HomepagePropsType): React.JSX.Element {
  const { count, onIncrementCountBy, intl } = props;
  const [increasedBy, setIncreasedBy] = useState(1);
  const description = intl.formatMessage({ id: "Homepage.description" });
  const title = intl.formatMessage({ id: "Homepage.title" });
  const handleOnClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    onIncrementCountBy(increasedBy);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setIncreasedBy(Number(value) || 1);
  };

  return (
    // This is important
    // Wrap your route component with the Page component.
    // The Page component injects various meta tags related to SEO and other common meta tags.
    // Want to know which props pass to the Page component, see Page.tsx for details
    <Page description={description} metaTitle={title}>
      <div className='App'>
        <header>Root path</header>
        <NamedLink name={routesName.Homepage}>Homepage</NamedLink>
        <NamedLink name={routesName.Aboutpage}>About</NamedLink>
        <NamedLink name={routesName.ProductsPage}>Products</NamedLink>

        <input
          id='increasedBy'
          type='text'
          placeholder='By'
          onChange={handleOnChange}
          value={increasedBy}
        />

        <button onClick={handleOnClick} type='button'>
          increment
        </button>
        <span>The count is:{count}</span>
      </div>
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

export default stateAndDispatchWrapper<HomepagePropsType>(
  HomepageComponent,
  customMapToState,
  customMapToDispatch
);
