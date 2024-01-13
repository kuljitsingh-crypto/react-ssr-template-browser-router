const ensureRoolUrl = (url: string) => url.replace(/\/$/, "");
const rootUrl =
  process.env.REACT_APP_CANONICAL_ROOT_URL || "http://localhost:3000";
// Address information is used in SEO schema for Organization (http://schema.org/PostalAddress)
const addressCountry = "FI";
const addressRegion = "Helsinki";
const postalCode = "00100";
const streetAddress = "Bulevardi 14";
export const FETCH_STATUS = {
  idle: "idle",
  loading: "loading",
  succeeded: "succeeded",
  failed: "failed",
} as const;

export const config = {
  siteFacebookPage: "http://facebook.com",
  siteTwitterHandle: "http://x.com",
  siteInstagramPage: "http://instagram.com",
  canonicalRootUrl: ensureRoolUrl(rootUrl),
  address: { addressCountry, addressRegion, postalCode, streetAddress },
  contentType: "website",
  twitterHandle: "@me",
} as const;
