import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { Home } from "@/routes/home";
import { Login } from "@/routes/login";
import { Logout } from "@/routes/logout";
import { Edit } from "@/routes/edit";
import { Register } from "@/routes/register";
import React from "react";
import { Profile } from "@/routes/profile";

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
            <div className="flex justify-center items-center h-screen">
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
