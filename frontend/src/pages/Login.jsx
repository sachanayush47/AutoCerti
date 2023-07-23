import { Link, useNavigate } from "react-router-dom";
import BackgroundImage from "../assets/register_bg_2.png";
import { AuthContext } from "../context/authContextProvider";

import { useState, useContext, useEffect } from "react";
import { notifyError } from "../utils/toastify";

export default function Login() {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const navigate = useNavigate();
    const { login, currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (currentUser) {
            navigate(-1);
        }
    }, []);

    const onLogin = async (e) => {
        e.preventDefault();
        try {
            await login({ username, password });
            navigate("/");
        } catch (error) {
            console.log(error);
            notifyError(error.response.data.err);
        }
    };

    return (
        <main>
            <section className="absolute w-full h-full auth">
                <div
                    className="absolute top-0 w-full h-full bg-blue-900"
                    style={{
                        backgroundImage: `url(${BackgroundImage})`,
                        backgroundSize: "100%",
                        backgroundRepeat: "no-repeat",
                    }}
                ></div>
                <div className="container mx-auto px-4 h-full">
                    <div className="flex content-center items-center justify-center h-full">
                        <div className="w-full lg:w-4/12 px-4">
                            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blue-50 border-0">
                                <div className="rounded-t mb-0 px-6 py-6"></div>
                                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                                    <form>
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-800 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Username
                                            </label>
                                            <input
                                                onChange={(e) => setUsername(e.target.value)}
                                                type="email"
                                                className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                                placeholder="Username"
                                                style={{ transition: "all .15s ease" }}
                                            />
                                        </div>

                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-800 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Password
                                            </label>
                                            <input
                                                onChange={(e) => setPassword(e.target.value)}
                                                type="password"
                                                className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                                placeholder="Password"
                                                style={{ transition: "all .15s ease" }}
                                            />
                                        </div>
                                        <div>
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    id="customCheckLogin"
                                                    type="checkbox"
                                                    className="form-checkbox border-0 rounded text-gray-800 ml-1 w-5 h-5"
                                                    style={{ transition: "all .15s ease" }}
                                                    checked
                                                    disabled
                                                />
                                                <span className="ml-2 text-sm font-semibold text-gray-800">
                                                    Remember me
                                                </span>
                                            </label>
                                        </div>

                                        <div className="text-center mt-6">
                                            <button
                                                onClick={onLogin}
                                                className="bg-blue-900 text-white active:bg-blue-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                                                type="button"
                                                style={{ transition: "all .15s ease" }}
                                            >
                                                Sign In
                                            </button>
                                        </div>
                                    </form>
                                    <div className="flex flex-wrap mt-6">
                                        <div className="w-1/2">
                                            <a
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                                className="font-bold text-blue-900"
                                            >
                                                <small>Forgot password?</small>
                                            </a>
                                        </div>
                                        <div className="w-1/2 text-right">
                                            <Link
                                                to="/register"
                                                className="font-bold text-blue-900"
                                            >
                                                <small>Create new account</small>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
