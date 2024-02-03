import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Edit } from "@/routes/edit";
import { Home } from "@/routes/home";
import { Login } from "@/routes/login";
import { Logout } from "@/routes/logout";
import { Profile } from "@/routes/profile";
import { Register } from "@/routes/register";

import { Toaster } from "./components/ui/sonner";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/logout",
        element: <Logout />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/edit",
        element: <Edit />,
    },
    {
        path: "/profile/:userId",
        element: <Profile />,
    },
]);

export const App: React.FC = () => {
    return (
        <React.StrictMode>
            <div className="flex h-screen items-center justify-center">
                <RouterProvider router={router} />
            </div>
            <Toaster
                position="top-center"
                richColors
                closeButton
                pauseWhenPageIsHidden
            />
        </React.StrictMode>
    );
};
