import { Link, useNavigate } from "react-router-dom";
import BackgroundImage from "../assets/register_bg_2.png";
import { useState } from "react";
import axios from "axios";
import { notifyError } from "../utils/toastify";

export default function Login() {
    const [name, setName] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

    const onRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("/auth/create-account", { name, username, password });
            console.log(res.data);
            navigate("/login");
        } catch (error) {
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
                                                Name
                                            </label>
                                            <input
                                                onChange={(e) => setName(e.target.value)}
                                                type="text"
                                                className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                                placeholder="Name"
                                                style={{ transition: "all .15s ease" }}
                                            />
                                        </div>
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-800 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Username
                                            </label>
                                            <input
                                                onChange={(e) => setUsername(e.target.value)}
                                                type="text"
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

                                        <div className="text-center mt-6">
                                            <button
                                                onClick={onRegister}
                                                className="bg-blue-900 text-white active:bg-blue-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                                                type="button"
                                                style={{ transition: "all .15s ease" }}
                                            >
                                                Sign Up
                                            </button>
                                        </div>
                                    </form>
                                    <div className="flex flex-wrap mt-6">
                                        <div className="w-3/4">
                                            <Link to="/login" className="font-bold text-blue-900">
                                                <small>Already have a account?</small>
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
