import axios from "axios";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { auth } from "@/api";
import { buttonVariants } from "@/components/ui/button";

import { ROUTES, STORAGE_KEYS } from "./routes";

export const Logout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem(STORAGE_KEYS.access))
            auth.logout().then(() => {
                localStorage.removeItem(STORAGE_KEYS.access);
                localStorage.removeItem(STORAGE_KEYS.refresh);

                axios.defaults.headers.common["Authorization"] = null;
            });
        else navigate(ROUTES.login);
    }, []);

    return (
        <>
            You have logged out successfully.{" "}
            <Link
                className={buttonVariants({ variant: "link" })}
                to={ROUTES.login}
            >
                Login
            </Link>
        </>
    );
};
