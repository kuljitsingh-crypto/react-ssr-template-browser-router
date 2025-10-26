import { ConfigurationType } from "@src/custom-config";

const ensureRootUrl = (url: string) => url.replace(/\/$/, "");

export const apiBaseUrl = (config: ConfigurationType) => {
  const baseUrl = config.canonicalRootUrl;
  const rootPath = config.apiRootPath;
  const base = ensureRootUrl(`${baseUrl}${rootPath}`);
  const apiBaseUrl = `${base}/api`;
  return apiBaseUrl;
};
