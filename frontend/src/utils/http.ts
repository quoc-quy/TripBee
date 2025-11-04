import type { AxiosInstance } from "axios";
import axios from "axios";
import {
  clearAccessTokenFromLS,
  getAccessTokenFromLS,
  saveAccessTokenToLS,
} from "./auth";

class Http {
  instance: AxiosInstance;
  private accessToken: string;
  constructor() {
    this.accessToken = getAccessTokenFromLS();
    this.instance = axios.create({
      baseURL: "http://localhost:8080/api/",
      timeout: 2000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.response.use((response) => {
      const { url } = response.config;

      if (url == "auth/login" || url == "auth/register") {
        this.accessToken = response.data.token;
        saveAccessTokenToLS(this.accessToken);
      } else if (url == "/logout") {
        this.accessToken = "";
        clearAccessTokenFromLS();
      }

      return response;
    });
  }
}

const http = new Http().instance;

export default http;
