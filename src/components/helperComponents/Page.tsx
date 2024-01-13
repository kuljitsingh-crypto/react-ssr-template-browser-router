import React from "react";
import ReactHelmet, { ReactHelmetPropsTypes } from "./ReactHelmet";
import { useCustomRouterDetails } from "../../hooks";
import { routes } from "../../utill/routes";
import { canonicalRoutePath } from "../../utill/routesHelperFunction";
import { useIntl } from "react-intl";
import { config } from "../../custom-config";

export type ModifiedHelmetProps = Omit<
  ReactHelmetPropsTypes,
  "url" | "author" | "twitterHandle"
>;

type PageProps = {
  contentRootClassName?: string;
  author?: string;
  twitterHandle?: string;
  children: React.ReactNode;
} & ModifiedHelmetProps;

function Page(props: PageProps): React.JSX.Element {
  const {
    children,
    contentRootClassName,
    keywords,
    description,
    contentType,
    author: propAuthor,
    customFacebookImage,
    customTwitterImage,
    metaTitle,
    siteTitle,
    published,
    updated,
    twitterHandle: propTwitterHandle,
    referrer,
    schema,
  } = props;
  const router = useCustomRouterDetails(routes);
  const intl = useIntl();
  const url = canonicalRoutePath(router.location);
  const author =
    propAuthor || intl.formatMessage({ id: "webAuthor" }, { name: "me" });
  const twitterHandle = propTwitterHandle || config.twitterHandle;
  const metaProps = {
    keywords,
    description,
    contentType,
    author,
    customFacebookImage,
    customTwitterImage,
    url,
    metaTitle,
    siteTitle,
    published,
    updated,
    twitterHandle,
    referrer,
    schema,
  };

  return (
    <div className={contentRootClassName}>
      <ReactHelmet {...metaProps} />
      {children}
    </div>
  );
}

Page.displayName = "Page";

export default Page;
