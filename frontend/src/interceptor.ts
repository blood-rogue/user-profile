import axios, { AxiosResponse, AxiosError } from "axios";
import { API_URL } from "./api";
import { STORAGE_KEYS } from "./routes/routes";

let refresh = false;

axios.interceptors.response.use(
    (resp: AxiosResponse) => {
        resp.data = Object.entries(resp.data).reduce((acc, [key, value]) => {
            const modifiedKey = key.replace(/_([a-z])/g, (g) =>
                g[1].toUpperCase()
            );

            return { ...acc, [modifiedKey]: value };
        }, {} as { [key: string]: unknown });

        return resp;
    },

    async (error: AxiosError) => {
        const refresh_token = localStorage.getItem(STORAGE_KEYS.refresh);

        if (error.response?.status === 401 && !refresh && refresh_token) {
            refresh = true;
            const response = await axios.post(
                `${API_URL}/token/refresh`,
                {
                    refresh: refresh_token,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${response.data["access"]}`;
                localStorage.setItem(STORAGE_KEYS.access, response.data.access);
                localStorage.setItem(
                    STORAGE_KEYS.refresh,
                    response.data.refresh
                );

                return axios(error.config!);
            }
        }

        refresh = false;
        return Promise.reject(error);
    }
);
