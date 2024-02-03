import axios from "axios";

import { API_URL, UserProfile } from ".";

const get = async (id: string) =>
    await axios.get<UserProfile>(`${API_URL}/user/${id}`);

const edit = async (
    id: string,
    userProfile: Omit<UserProfile, "dateJoined" | "avatar" | "username">,
) =>
    await axios.put(
        `${API_URL}/user/${id}`,
        Object.entries(userProfile).reduce(
            (acc, [key, value]) => ({
                ...acc,
                [key.replace(/([A-Z])/g, "_$1").toLowerCase()]: value,
            }),
            {},
        ),
    );

const del = async (id: string) => await axios.delete(`${API_URL}/user/${id}`);

export const user = {
    get,
    edit,
    del,
};
