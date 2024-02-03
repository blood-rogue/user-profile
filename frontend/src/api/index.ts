export interface UserProfile {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    dateJoined: string;
    avatar: string;
}

export const API_URL = "http://localhost:8000/api";

export { user } from "./user";
export { auth } from "./auth";
