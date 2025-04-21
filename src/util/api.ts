import { ConfigurationType } from "@src/custom-config";

export const getApiBaseUrl = (config: ConfigurationType) => {
  const baseUrl = config.canonicalRootUrl;
  const rootPath = config.apiRootPath;
  const apiBaseUrl = `${baseUrl}${rootPath}/api`;
  return apiBaseUrl;
};
