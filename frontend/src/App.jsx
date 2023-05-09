import { useState, useEffect } from "react";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "react-quill/dist/quill.snow.css";

import NotFound from "./pages/NotFound";
import Write from "./pages/Write";
import Print from "./pages/print";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import History from "./pages/History";

import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_URL;
axios.defaults.withCredentials = true;

const Layout = () => {
    return (
        <>
            <Navigation />
            <Outlet />
        </>
    );
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: <Write /> },
            { path: "/verify", element: <Verify /> },
            { path: "/history", element: <History /> },
            { path: "*", element: <NotFound /> },
        ],
    },
    {
        path: "/print",
        element: <Print />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
]);

function App() {
    return (
        <div className="mx-auto">
            <ToastContainer theme="dark" />

            <RouterProvider router={router} />
        </div>
    );
}
export default App;
