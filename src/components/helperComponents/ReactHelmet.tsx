import React from "react";
import facebookImage from "@src/assets/facebook.png";
import twitterImage from "@src/assets/twitter.png";
import { ConfigurationType } from "@src/custom-config";
import { useIntl } from "react-intl";
import { Helmet } from "react-helmet-async";

const FACEBOOK_IMAGE_WIDTH = 1200;
const FACEBOOK_IMAGE_HEIGHT = 630;
// const TWITTER_IMAGE_WIDTH = 600;
// const TWITTER_IMAGE_HEIGHT = 314;
const TWITTER_CARD_CONTENT = "summary_large_image";

const ensureRootUrl = (url: string) => url.replace(/\/$/, "");

export type ReactHelmetPropsTypes = {
  keywords?: string[];
  description: string;
  contentType?: string;
  author: string;
  customFacebookImage?: { url: string; width: number; height: number };
  customTwitterImage?: { url: string };
  url: string;
  metaTitle: string;
  siteTitle?: string;
  published?: string;
  updated?: string;
  twitterHandle: string;
  referrer?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
  config: ConfigurationType;
};
type FacebookMetaTagDetails = {
  description: string;
  title: string;
  contentType: string | undefined;
  url: string;
  locale: string | undefined;
  canonicalRootUrl: string;
  customFacebookImage?: { url: string; width: number; height: number };
  siteTitle?: string;
  facebookAppId?: string;
  published?: string;
  updated?: string;
  tags?: string[];
  rootPath: string;
};

type TwitterMetaTagDetails = {
  description: string;
  title: string;
  siteTwitterHandle?: string;
  canonicalRootUrl: string;
  url: string;
  twitterHandle?: string;
  customTwitterImage?: { url: string };
  rootPath: string;
};

const createMetaTagForFaceBook = (metaDetails: FacebookMetaTagDetails) => {
  const {
    description,
    title,
    contentType,
    url,
    locale,
    canonicalRootUrl,
    customFacebookImage,
    siteTitle,
    facebookAppId,
    published,
    updated,
    tags,
    rootPath,
  } = metaDetails;

  if (
    !title ||
    !description ||
    !contentType ||
    !url ||
    !canonicalRootUrl ||
    !locale
  ) {
    return {};
  }
  const openGraphMeta: Record<string, unknown> = {
    "og:description": description,
    "og:title": title,
    "og:type": contentType,
    "og:url": url,
    "og:locale": locale,
  };
  if (
    customFacebookImage &&
    customFacebookImage.url &&
    customFacebookImage.width &&
    customFacebookImage.height
  ) {
    openGraphMeta["og:image"] = customFacebookImage.url;
    openGraphMeta["og:image:width"] = customFacebookImage.width;
    openGraphMeta["og:image:height"] = customFacebookImage.height;
  } else {
    const facebookImageUrl = `${ensureRootUrl(
      canonicalRootUrl
    )}${rootPath}${facebookImage}`;
    openGraphMeta["og:image"] = facebookImageUrl;
    openGraphMeta["og:image:width"] = FACEBOOK_IMAGE_WIDTH;
    openGraphMeta["og:image:height"] = FACEBOOK_IMAGE_HEIGHT;
  }

  if (siteTitle) {
    openGraphMeta["og:site_name"] = siteTitle;
  }

  if (facebookAppId) {
    openGraphMeta["fb:app_id"] = facebookAppId;
  }

  if (published) {
    openGraphMeta["article:published_time"] = published;
  }

  if (updated) {
    openGraphMeta["article:modified_time"] = updated;
  }

  if (tags && tags.length > 0) {
    openGraphMeta["article:tag"] = tags.join(",");
  }
  return openGraphMeta;
};
const createMetaTagForTwitter = (metaDetails: TwitterMetaTagDetails) => {
  const {
    siteTwitterHandle,
    url,
    title,
    description,
    customTwitterImage,
    canonicalRootUrl,
    twitterHandle,
    rootPath,
  } = metaDetails;
  if (!siteTwitterHandle || !url || !title || !description || !canonicalRootUrl)
    return {};
  const twitterMeta: Record<string, unknown> = {
    "twitter:card": TWITTER_CARD_CONTENT,
    "twitter:site": siteTwitterHandle,
    "twitter:url": url,
    "twitter:title": title,
    "twitter:description": description,
  };
  if (customTwitterImage && customTwitterImage.url) {
    twitterMeta["twitter:image"] = customTwitterImage.url;
  } else {
    const twitterImageUrl = `${ensureRootUrl(
      canonicalRootUrl
    )}${rootPath}${twitterImage}`;
    twitterMeta["twitter:image"] = twitterImageUrl;
  }
  if (twitterHandle) {
    // TODO: If we want to connect providers twitter account on ListingPage
    // we needs to get this info among listing data (API support needed)
    twitterMeta["twitter:creator"] = twitterHandle;
  }

  if (canonicalRootUrl) {
    twitterMeta["twitter:domain"] = `${canonicalRootUrl}${rootPath}`;
  }
  return twitterMeta;
};

const twitterPageURL = (siteTwitterHandle: String) => {
  if (siteTwitterHandle && siteTwitterHandle.charAt(0) === "@") {
    return `https://x.com/${siteTwitterHandle.substring(1)}`;
  } else if (siteTwitterHandle) {
    return `https://x.com/${siteTwitterHandle}`;
  }
  return null;
};

function ReactHelmet(props: ReactHelmetPropsTypes) {
  const {
    keywords,
    description,
    author,
    contentType: typeOfContent,
    metaTitle: title,
    siteTitle,
    url,
    published,
    updated,
    customFacebookImage,
    customTwitterImage,
    twitterHandle,
    referrer,
    schema,
    config,
  } = props;
  const intl = useIntl();
  const locale = intl?.locale;
  const canonicalRootUrl = config.canonicalRootUrl;
  const rootPath = config.rootPath || "";
  const siteTwitterHandle = config.seo.siteTwitterHandle;
  const images = config.images;
  const theme = config.theme;
  const contentType = typeOfContent || config.seo.contentType;
  const facebookMetaTags = createMetaTagForFaceBook({
    title,
    description,
    contentType,
    canonicalRootUrl,
    locale,
    url,
    customFacebookImage,
    siteTitle,
    tags: keywords,
    published,
    updated,
    rootPath,
  });
  const twitterMetaTags = createMetaTagForTwitter({
    title,
    canonicalRootUrl,
    description,
    twitterHandle,
    siteTwitterHandle,
    customTwitterImage,
    url,
    rootPath,
  });

  const keywordsMaybe =
    keywords && Array.isArray(keywords) && keywords.length > 0
      ? { keywords: keywords.join(",") }
      : {};

  const referrerMetaMaybe = referrer ? { referrer: referrer } : {};

  const metaObject = {
    description,
    author,
    ...referrerMetaMaybe,
    ...keywordsMaybe,
    ...facebookMetaTags,
    ...twitterMetaTags,
  };

  const metaToHead = Object.entries(metaObject).map(
    (metaArr: [string, string]) => (
      <meta name={metaArr[0]} content={metaArr[1]} key={metaArr[0]} />
    )
  );

  // Schema for search engines (helps them to understand what this page is about)
  // http://schema.org
  // Here JSON-LD format is used

  // Schema attribute can be either single schema object or an array of objects
  // This makes it possible to include several different items from the same page.
  // E.g. Product, Place, Video const schemaFromProps = Array.isArray(schema) ? schema : [schema];
  const facebookPage = config.seo.siteFacebookPage;
  const twitterPage = twitterPageURL(config.seo.siteTwitterHandle);
  const instagramPage = config.seo.siteInstagramPage;
  const sameOrganizationAs = [facebookPage, twitterPage, instagramPage].filter(
    (v) => v != null
  );
  const schemaImage = `${canonicalRootUrl}${rootPath}${facebookImage}`;

  const schemaFromProps = schema
    ? Array.isArray(schema)
      ? schema
      : [schema]
    : [];

  const schemaArrayJSONString = JSON.stringify([
    ...schemaFromProps,
    {
      "@context": "http://schema.org",
      "@type": "WebPage",
      description: description,
      name: title,
      image: [schemaImage],
    },
    {
      "@context": "http://schema.org",
      "@type": "Organization",
      "@id": `${canonicalRootUrl}#organization`,
      url: canonicalRootUrl,
      name: siteTitle,
      sameAs: sameOrganizationAs,
      logo: images.logo192,
      address: config.address,
    },
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      url: canonicalRootUrl,
      description: description,
      name: title,
      publisher: {
        "@id": `${canonicalRootUrl}#organization`,
      },
    },
  ]);

  return (
    <Helmet htmlAttributes={{ lang: locale }}>
      <title>{title}</title>
      <meta name='theme-color' content={theme.color} />
      {metaToHead}
      <link rel='canonical' href={canonicalRootUrl} />
      <link rel='apple-touch-icon' href={images.logo192} />
      <link rel='apple-touch-icon' sizes='180x180' href={images.logo180} />
      <link rel='icon' type='image/png' sizes='32x32' href={images.logo32} />
      <link rel='icon' type='image/png' sizes='16x16' href={images.logo16} />
      <link rel='mask-icon' href={images.logo192} color={theme.color} />
      <link rel='shortcut icon' href={images.favicon} />
      <link rel='icon' href={images.favicon} />
      <meta httpEquiv='Content-Type' content='text/html; charset=UTF-8' />
      <meta httpEquiv='Content-Language' content={locale} />
      <script id='page-schema' type='application/ld+json'>
        {schemaArrayJSONString.replace(/</g, "\\u003c")}
      </script>
    </Helmet>
  );
}

export default ReactHelmet;
