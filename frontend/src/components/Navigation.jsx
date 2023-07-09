import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContextProvider";

export default function Navigation() {
    const { currentUser, logout } = useContext(AuthContext);
    const [navbarOpen, setNavbarOpen] = React.useState(false);
    const navigate = useNavigate();

    const signOut = async (e) => {
        e.preventDefault();
        await logout();
        navigate("/login");
    };

    return (
        <div className="nav">
            <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-blue-900">
                <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                    <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                        <Link to="/">
                            <div className="text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap text-white space-x-2">
                                <i class="fa-solid fa-certificate"></i>
                                {/* <span>&nbsp;&nbsp;&nbsp;</span> */}
                                <span>AutoCerti</span>
                            </div>
                        </Link>
                        <button
                            className="text-white cursor-pointer text-xl leading-none px-0 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                            type="button"
                            onClick={() => setNavbarOpen(!navbarOpen)}
                        >
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                    <div
                        className={
                            "lg:flex flex-grow items-center" + (navbarOpen ? " flex" : " hidden")
                        }
                        id="example-navbar-danger"
                    >
                        <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                            <li className="nav-item">
                                <Link
                                    to="/verify"
                                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                                >
                                    <i className="fa-brands fa-cloudversify text-lg leading-lg text-white opacity-75"></i>
                                    <span className="ml-2">Verify</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    to="/write"
                                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                                >
                                    <i className="fa-brands fa-cloudversify text-lg leading-lg text-white opacity-75"></i>
                                    <span className="ml-2">Tool</span>
                                </Link>
                            </li>
                            {currentUser ? (
                                <>
                                    <li className="nav-item">
                                        <Link
                                            to="/history"
                                            className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                                        >
                                            <i className="fa-sharp fa-solid fa-clock-rotate-left text-lg leading-lg text-white opacity-75"></i>
                                            <span className="ml-2">History</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            onClick={signOut}
                                            className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                                        >
                                            <i className="fa-sharp fa-solid fa-right-from-bracket text-lg leading-lg text-white opacity-75"></i>
                                            <span className="ml-2">Logout</span>
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to="/login">
                                            <div className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
                                                <i className="fas fa-sign-in text-lg leading-lg text-white opacity-75"></i>
                                                <span className="ml-2">Login</span>
                                            </div>
                                        </Link>
                                    </li>
                                    {/* <li className="nav-item">
                                        <Link to="/register">
                                            <div className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
                                                <i className="fa-sharp fa-solid fa-right-from-bracket text-lg leading-lg text-white opacity-75"></i>
                                                <span className="ml-2">Register</span>
                                            </div>
                                        </Link>
                                    </li> */}
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}
