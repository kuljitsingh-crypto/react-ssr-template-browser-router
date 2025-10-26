import axios from "axios";
import { apiBaseUrl } from "./api";
import { ConfigurationType } from "@src/custom-config";

class CSRFToken {
  #token: null | string = null;
  static #instance: null | CSRFToken = null;

  constructor() {
    if (CSRFToken.#instance == null) {
      CSRFToken.#instance = this;
    }
    return CSRFToken.#instance;
  }

  get token() {
    return this.#token;
  }

  setAsync(config: ConfigurationType): Promise<string | null> {
    //Assuming Path to fetch CSRF token is '/api/csrf-token'
    // You may change it as per your backend implementation
    const url = `${apiBaseUrl(config)}/csrf-token`;
    return axios.get(url, { withCredentials: true }).then((resp) => {
      const { csrfToken } = resp.data;
      this.#token = csrfToken;
      return csrfToken;
    });
  }

  set(csrfToken: string | null) {
    this.#token = csrfToken;
  }
}

export const csrfToken = new CSRFToken();
