import React from "react";
import ReactHelmet, {
  ReactHelmetPropsTypes,
} from "@src/components/helperComponents/ReactHelmet";
import { useCustomRouter } from "@src/hooks";
import { routes } from "@src/util/routes";
import { canonicalRoutePath } from "@src/util/routesHelperFunction";
import { useConfiguration } from "@src/context";
import classNames from "classnames";
import { useSelector } from "react-redux";
import LeftChild from "../LeftChild/LeftChild";
import RightChild from "../RIghtChild/RightChild";
import { isAppHasDarkTheme } from "@src/util/themeHelper";
import {
  WindowDimension,
  windowDimensionProvider,
} from "../helperComponents/windowDimension";
import { ScreenDimensionProvider } from "./pageHooks";
import { selectStateValue } from "@src/storeHelperFunction";

export type ModifiedHelmetProps = Omit<
  ReactHelmetPropsTypes,
  | "url"
  | "author"
  | "twitterHandle"
  | "config"
  | "customFacebookImage"
  | "customTwitterImage"
  | "keywords"
  | "siteTitle"
  | "referrer"
  | "schema"
  | "contentType"
  | "published"
  | "updated"
>;

type PageProps = {
  contentRootClassName?: string;
  children: React.ReactNode;
} & ModifiedHelmetProps & { windowDimensions: WindowDimension };

const appClassName = "App";

const prepareChildren = (
  children: React.ReactNode,
  otherOptions: Record<string, any>
) => {
  const preparedChildren = {} as Record<
    "leftChild" | "rightChild",
    React.ReactNode
  >;
  let hasLeftChild = false;
  React.Children.forEach(children, (child) => {
    if ((child as any).type === LeftChild) {
      hasLeftChild = true;
      preparedChildren.leftChild = React.cloneElement(child as any, {
        rootClassName: "leftChild",
        ...otherOptions,
      });
    } else if ((child as any).type === RightChild) {
      preparedChildren.rightChild = React.cloneElement(child as any, {
        rootClassName: "rightChild" + (hasLeftChild ? "" : " noLeftChild"),
        hasLeftChild,
        ...otherOptions,
      });
    } else {
      throw new Error(
        "Invalid child type:  only LeftChild and RightChild are supported"
      );
    }
  });
  return preparedChildren;
};
function Page(props: PageProps): React.JSX.Element {
  const {
    children,
    contentRootClassName,
    description,
    metaTitle,
    windowDimensions,
  } = props;
  const router = useCustomRouter(routes);
  const url = canonicalRoutePath(router.location);
  const config = useConfiguration();
  const author = config.seo.author;
  const twitterHandle = config.seo.twitterHandle;
  const metaProps = {
    keywords: config.seo.keywords,
    description,
    contentType: config.seo.contentType,
    author,
    customFacebookImage: config.seo.facebookImage,
    customTwitterImage: config.seo.twitterImage,
    url,
    metaTitle,
    siteTitle: config.seo.siteTitle,
    published: config.seo.published,
    updated: config.seo.updated,
    twitterHandle,
    referrer: config.seo.referrer,
    schema: config.seo.schema,
  };
  const theme = useSelector(selectStateValue("ui", "theme"));
  const [showLeftChild, setShowLeftChild] = React.useState(true);
  const themeClassName = isAppHasDarkTheme(theme) ? "darkTheme" : "lightTheme";
  const rootClasses = classNames(
    appClassName,
    themeClassName,
    contentRootClassName
  );
  const mainClassName = "main";
  const toggleLeftChild = () => {
    setShowLeftChild((status) => !status);
  };
  const preparedChildren = prepareChildren(children, {
    showLeftChild,
    toggleLeftChild,
  });

  return (
    <ScreenDimensionProvider value={windowDimensions}>
      <div className={rootClasses}>
        <ReactHelmet {...metaProps} config={config} />
        <div className={mainClassName}>
          {preparedChildren.leftChild} {preparedChildren.rightChild}
        </div>
      </div>
    </ScreenDimensionProvider>
  );
}

Page.displayName = "Page";

export default windowDimensionProvider(Page);
