import type { AxiosInstance } from "axios";
import axios from "axios";

class Http {
    instance: AxiosInstance;
    constructor() {
        this.instance = axios.create({
            baseURL: "/api/",
            timeout: 2000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}

const http = new Http();

export default http;
