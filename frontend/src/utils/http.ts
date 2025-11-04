import type { AxiosInstance } from "axios";
import axios from "axios";
import { clearLS, getAccessTokenFromLS, saveAccessTokenToLS, setProfileToLS } from "./auth";
import type { AuthResponse } from "../types/auth.type";
import type { SimpleProfile } from "../types/user.type";

class Http {
    instance: AxiosInstance;
    private accessToken: string;
    constructor() {
        this.accessToken = getAccessTokenFromLS();
        this.instance = axios.create({
            baseURL: "/api/",
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
                const data = response.data as AuthResponse;
                this.accessToken = data.token;
                saveAccessTokenToLS(this.accessToken);
                const simpleProfile: SimpleProfile = {
                    userID: data.userId,
                    email: data.email,
                    role: data.role,
                };
                setProfileToLS(simpleProfile);
            } else if (url == "auth/logout") {
                this.accessToken = "";
                clearLS();
            }

            return response;
        });
    }
}

const http = new Http().instance;

export default http;
