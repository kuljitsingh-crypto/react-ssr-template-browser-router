import axios, { Axios, AxiosRequestConfig } from "axios";
import { csrfToken } from "./csrfTokenHelper";

type ExtraConfig = { withCredentials?: boolean; withCSRFToken?: boolean };
type UpdatedRequestConfig = AxiosRequestConfig & ExtraConfig;

export class HttpClient {
  static #instance: HttpClient | null = null;
  #axiosInstance: Axios = axios.create();
  constructor(baseUrl?: string) {
    if (HttpClient.#instance === null) {
      HttpClient.#instance = this;
      const baseConfig: Record<string, any> = { withCredentials: false };
      if (baseUrl) {
        baseConfig.baseURL = baseUrl;
      }
      this.#axiosInstance = axios.create(baseConfig);
      this.#setupInterceptors();
    }
    return HttpClient.#instance;
  }

  #setupInterceptors() {
    this.#axiosInstance.interceptors.response.use(
      async (resp) => {
        // Assume CSRF token is sent in response data as 'csrfToken'
        // If your backend sends it differently, adjust accordingly
        const token = resp.data?.csrfToken;
        if (token) {
          delete resp.data.csrfToken;
          csrfToken.set(token || null);
        }

        return resp;
      },
      (error) => Promise.reject(error)
    );
  }
  #mergeConfig(config?: UpdatedRequestConfig): AxiosRequestConfig {
    const {
      withCSRFToken,
      withXSRFToken,
      withCredentials = false,
    } = config || {};
    const headers = { ...config?.headers };
    const includeCsrfToken =
      (withCSRFToken || withXSRFToken) && csrfToken.token !== null;
    if (includeCsrfToken) {
      (headers as any)["X-CSRF-Token"] = csrfToken.token!;
    }
    return {
      ...config,
      headers,
      withCredentials: withCredentials,
    };
  }

  get<T = any>(url: string, config?: UpdatedRequestConfig) {
    return this.#axiosInstance.get<T>(url, this.#mergeConfig(config));
  }

  post<T = any>(url: string, data?: any, config?: UpdatedRequestConfig) {
    return this.#axiosInstance.post<T>(url, data, this.#mergeConfig(config));
  }

  put<T = any>(url: string, data?: any, config?: UpdatedRequestConfig) {
    return this.#axiosInstance.put<T>(url, data, this.#mergeConfig(config));
  }

  patch<T = any>(url: string, data?: any, config?: UpdatedRequestConfig) {
    return this.#axiosInstance.patch<T>(url, data, this.#mergeConfig(config));
  }

  delete<T = any>(url: string, config?: UpdatedRequestConfig) {
    return this.#axiosInstance.delete<T>(url, this.#mergeConfig(config));
  }
}
