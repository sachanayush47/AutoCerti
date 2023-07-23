import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";

import BackgroundImage from "../assets/register_bg_2.png";
import { AuthContext } from "../context/authContextProvider";

import { useState, useContext, useEffect } from "react";
import { notifyError, notifySuccess, updateToast } from "../utils/toastify";
import { toast } from "react-toastify";

const Account = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const [count, setCount] = useState(0);
    const [freshUserDetails, setFreshUserDetails] = useState(null);

    const navigate = useNavigate();
    const location = useLocation().search;

    const signOut = async (e) => {
        e.preventDefault();
        await logout();
        navigate("/login");
    };

    const [searchParams, setSearchParams] = useSearchParams(location);

    useEffect(() => {
        if (searchParams.has("payment_success")) {
            searchParams.delete("payment_success");
            setSearchParams(searchParams);
            notifySuccess("Payment successful. Thanks");
        } else if (searchParams.has("payment_failed")) {
            searchParams.delete("payment_failed");
            setSearchParams(searchParams);
            notifyError("Payment failed, please try again");
        }

        (async () => {
            const user = await axios.get("/auth/user-details");
            setFreshUserDetails(user.data);
        })();
    }, []);

    const makePayment = async () => {
        const id = toast.loading("Generating payment link...");

        const VITE_STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        const stripe = await loadStripe(VITE_STRIPE_PUBLISHABLE_KEY);

        let session;
        try {
            session = (await axios.post("/credits/buy-credits", { count })).data;
            const result = stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (result.error) {
                console.log(result.error);
            }
        } catch (error) {
            updateToast(id, error.response.data.err, "error");
        }
    };

    return (
        <div>
            <main>
                <section className="absolute w-full h-full">
                    <div
                        className="absolute top-0 w-full h-full bg-blue-900"
                        style={{
                            backgroundImage: `url(${BackgroundImage})`,
                            backgroundSize: "100%",
                            backgroundRepeat: "no-repeat",
                        }}
                    ></div>
                    <div className="container mx-auto my-auto px-4 h-full">
                        <div className="flex content-center items-center justify-center h-5/6">
                            <div className="w-full lg:w-4/12 px-4">
                                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blue-50 border-0">
                                    {/* <div className="rounded-t mb-0 px-6 py-6"></div> */}
                                    <div className="flex-auto px-4 lg:px-10 py-10 pt-5">
                                        {currentUser ? (
                                            <form>
                                                <div className="relative w-full mb-3">
                                                    <div className="text-center">
                                                        <div className="text-left text-lg text-blue-950 font-bold mb-6">
                                                            <span>{freshUserDetails?.name} </span> •
                                                            <span>
                                                                {" "}
                                                                {freshUserDetails?.credit} credits
                                                                left{" "}
                                                            </span>{" "}
                                                            •
                                                            <span>
                                                                {" "}
                                                                {
                                                                    freshUserDetails?.totalIssuedCertificate
                                                                }{" "}
                                                                certficates distributed till date
                                                            </span>
                                                        </div>
                                                        <div className="flex">
                                                            <button
                                                                className="bg-emerald-400 text-white active:bg-emerald-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 w-full"
                                                                type="button"
                                                                style={{
                                                                    transition: "all .15s ease",
                                                                }}
                                                                onClick={makePayment}
                                                            >
                                                                Buy Credits
                                                            </button>
                                                            <input
                                                                onChange={(e) =>
                                                                    setCount(e.target.value)
                                                                }
                                                                type="number"
                                                                className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                                                placeholder="Count"
                                                                style={{
                                                                    transition: "all .15s ease",
                                                                }}
                                                            />
                                                        </div>
                                                        <p
                                                            className="text-left uppercase text-gray-500 text-xs font-bold mb-2"
                                                            htmlFor="grid-password"
                                                        >
                                                            1 Credit = Rs 1
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Link to="/history">
                                                        <button
                                                            className="bg-cyan-500 text-white
                                                        active:bg-cyan-700 text-base font-bold text-center uppercase
                                                        px-6 py-3 rounded shadow hover:shadow-lg
                                                        outline-none focus:outline-none mr-1 mb-1 w-full"
                                                            type="button"
                                                            style={{ transition: "all .15s ease" }}
                                                        >
                                                            History
                                                        </button>
                                                    </Link>
                                                    <button
                                                        className="bg-blue-700 text-white
                                                    active:bg-blue-900 text-base font-bold text-center uppercase
                                                    px-6 py-3 rounded shadow hover:shadow-lg
                                                    outline-none focus:outline-none mr-1 mb-1 w-full"
                                                        onClick={signOut}
                                                        type="button"
                                                        style={{ transition: "all .15s ease" }}
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="text-center mt-6 flex">
                                                <Link
                                                    className="bg-rose-500 text-white active:bg-rose-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                                                    to="/login"
                                                >
                                                    <button
                                                        type="button"
                                                        style={{ transition: "all .15s ease" }}
                                                    >
                                                        Sign In
                                                    </button>
                                                </Link>
                                                <Link
                                                    className="bg-orange-500 text-white active:bg-orange-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                                                    to="/register"
                                                >
                                                    <button
                                                        type="button"
                                                        style={{ transition: "all .15s ease" }}
                                                    >
                                                        Register
                                                    </button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Account;
