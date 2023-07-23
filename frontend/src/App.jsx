import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "react-quill/dist/quill.snow.css";

import NotFound from "./pages/NotFound";
import Write from "./pages/Write";
import Print from "./pages/Print";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import History from "./pages/History";
import Home from "./pages/Home";
import Account from "./pages/Account";

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
            { path: "/", element: <Home /> },
            { path: "/write", element: <Write /> },
            { path: "/verify", element: <Verify /> },
            { path: "/history", element: <History /> },
            { path: "*", element: <NotFound /> },
            { path: "/account", element: <Account /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
        ],
    },
    {
        path: "/print",
        element: <Print />,
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
