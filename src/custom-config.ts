const logo16 = "/static/icons/logo16.png";
const logo32 = "/static/icons/logo32.png";
const logo150 = "/static/icons/logo150.png";
const logo180 = "/static/icons/logo180.png";
const logo192 = "/static/icons/logo192.png";
const logo512 = "/static/icons/logo512.png";
const favicon = "/static/icons/favicon.ico";
const homeIcon = "/static/icons/homeIcon.png";
const brandIcon = "/static/icons/logo.png";

export const appTheme = {
  dark: "dark",
  light: "light",
  system: "system",
} as const;

export type Theme = (typeof appTheme)[keyof typeof appTheme];
export type ConfigurationType = {
  canonicalRootUrl: string;
  address: {
    addressCountry: string;
    addressRegion: string;
    postalCode: string;
    streetAddress: string;
  };
  apiRootPath?: string;
  seo: {
    siteFacebookPage: string;
    siteTwitterHandle: string;
    siteInstagramPage: string;
    contentType: string;
    twitterHandle: string;
    description: string;
    author: string;
    metaTitle: string;
    siteTitle?: string;
    published?: string;
    updated?: string;
    referrer?: string;
    facebookImage?: { url: string; width: number; height: number };
    twitterImage?: { url: string };
    schema?: Record<string, unknown> | Record<string, unknown>[];
    keywords?: string[];
  };
  images: {
    logo16: string;
    logo32: string;
    logo150: string;
    logo180: string;
    logo192: string;
    logo512: string;
    favicon: string;
    homeIcon: string;
  };
  branding: { icon: string };
  theme: {
    name: Theme;
    color: string;
  };
};

const rootUrl =
  process.env.REACT_APP_CANONICAL_ROOT_URL || "http://localhost:3000";
// Address information is used in SEO schema for Organization (http://schema.org/PostalAddress)
const addressCountry = "FI";
const addressRegion = "Helsinki";
const postalCode = "00100";
const streetAddress = "Bulevardi 14";

const ensureRootUrl = (url: string) => url.replace(/\/$/, "");

export const defaultConfig: ConfigurationType = {
  canonicalRootUrl: ensureRootUrl(rootUrl),
  address: { addressCountry, addressRegion, postalCode, streetAddress },
  seo: {
    siteFacebookPage: "https://facebook.com",
    siteTwitterHandle: "https://x.com",
    siteInstagramPage: "https://instagram.com",
    contentType: "website",
    twitterHandle: "@me",
    description: "Dashboard made with express-admin-dashboard",
    author: "express-admin-dashboard",
    metaTitle: "Dashboard",
  },
  images: {
    logo150,
    logo16,
    logo180,
    logo192,
    logo512,
    logo32,
    favicon,
    homeIcon,
  },
  branding: { icon: brandIcon },
  apiRootPath: "/",
  theme: { name: "light", color: "#fff" },
};

export const rippleAnimationDuration = 500; // 500ms

const mergeConfigImages = ({
  oldImages,
  newImages,
}: {
  oldImages?: ConfigurationType["images"];
  newImages?: Partial<ConfigurationType["images"]>;
}) => {
  const finalImages = {} as ConfigurationType["images"];
  Object.entries(oldImages || {}).forEach((image) => {
    const [key, value] = image as [keyof ConfigurationType["images"], string];
    finalImages[key] = `${newImages?.[key] || value}`;
  });
  Object.assign(finalImages, newImages || {});
  return finalImages;
};

export const mergeConfig = (
  oldConfig: Partial<ConfigurationType>,
  newConfig: Partial<ConfigurationType>
) => {
  const finalConfig = { ...oldConfig };
  newConfig.images = mergeConfigImages({
    oldImages: oldConfig.images,
    newImages: newConfig.images,
  });
  newConfig.seo = Object.assign({}, oldConfig.seo, newConfig.seo || {});
  if (newConfig.canonicalRootUrl) {
    newConfig.canonicalRootUrl = ensureRootUrl(newConfig.canonicalRootUrl);
  }
  if (newConfig.branding === undefined) {
    newConfig.branding = {} as any;
  }
  if (!newConfig.branding?.icon) {
    (newConfig.branding as Record<string, any>).icon = `${brandIcon}`;
  }
  Object.assign(finalConfig, newConfig);
  return finalConfig as ConfigurationType;
};

export class Config {
  static #config: ConfigurationType = defaultConfig;
  static getConfig() {
    return Config.#config;
  }
  static updateConfig(newConfig: Partial<ConfigurationType>) {
    Config.#config = mergeConfig(Config.#config, newConfig);
  }
}
