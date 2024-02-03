import axios from "axios";
import { API_URL } from ".";
import { STORAGE_KEYS } from "@/routes/routes";

const register = async (user: FormData) =>
    await axios.post(`${API_URL}/auth/register`, user);

const login = async (user: { username: string; password: string }) =>
    await axios.post<{ access: string; refresh: string }>(
        `${API_URL}/token`,
        user
    );

const logout = async () =>
    await axios.post(`${API_URL}/auth/logout`, {
        refresh_token: localStorage.getItem(STORAGE_KEYS.refresh),
    });

export const auth = {
    register,
    login,
    logout,
};
