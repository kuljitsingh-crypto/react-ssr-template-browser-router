import { ConfigurationType } from "@src/custom-config";

const ensureRootUrl = (url: string) => url.replace(/\/{1,}$/, "");

export const apiBaseUrl = (config: ConfigurationType) => {
  const port = process.env.REACT_APP_DEV_API_SERVER_PORT;
  const baseUrl = config.canonicalRootUrl;
  const rootPath = config.apiRootPath;
  const useDevApiServer = process.env.NODE_ENV === "development" && !!port;
  const apiLocalBase = ensureRootUrl(`http://localhost:${port}/${rootPath}`);
  const apiLocalServer = `${apiLocalBase}/api`;
  // In development, the dev API server is running in a different port
  if (useDevApiServer) {
    return apiLocalServer;
  }
  const base = ensureRootUrl(`${baseUrl}${rootPath}`);
  const apiBaseUrl = `${base}/api`;

  // Otherwise, use the given marketplaceRootURL parameter or the same domain and port as the frontend
  return apiBaseUrl
    ? apiBaseUrl
    : typeof window === "undefined"
    ? apiLocalServer
    : `${window.location.origin}`;
};
