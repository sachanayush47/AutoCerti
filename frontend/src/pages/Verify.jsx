import axios from "axios";
import React from "react";
import { useState } from "react";
import { notifyError } from "../utils/toastify";
import moment from "moment";

import "react-toastify/dist/ReactToastify.css";

// axios.defaults.baseURL = "https://autocerti-verify-only.onrender.com/api";

const App = () => {
    const [cid, setCid] = useState();
    const [value, setValue] = useState();

    const setId = (e) => {
        e.preventDefault();
        setCid(e.target.value);
    };

    const verifyCertificate = async () => {
        console.log(cid);
        try {
            const res = await axios.get(`/pdf/verify/${cid}`);
            setValue(res.data.message);
        } catch (error) {
            setValue(null);
            notifyError(error.response.data.err);
        }
    };

    return (
        <div>
            <div className="relative w-full mb-3 flex flex-col items-center mt-40">
                <label
                    className="block uppercase text-gray-800 text-xl font-bold mb-2"
                    htmlFor="grid-password"
                >
                    Validate your certificate here
                </label>
                <input
                    onChange={setId}
                    type="text"
                    className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white  rounded text-sm shadow focus:outline-none focus:ring w-64"
                    placeholder="UNIQUE CERTIFICATE ID"
                />
                <div className="mb-3 pt-0 mx-3">
                    <button
                        onClick={verifyCertificate}
                        className="mt-4 bg-blue-500 w-full text-white active:bg-blue-600 font-bold uppercase text-base px-6 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                    >
                        Verify
                    </button>
                </div>
            </div>

            {value && (
                <>
                    <div className="flex flex-col ml-auto mr-auto mt-8 p-5 bg-blue-50 sm:w-full md:w-3/4 lg:w-1/2 border-r-4">
                        <p>
                            <b>Email:</b> {value.email}
                        </p>
                        <p>
                            <b>Date: </b>
                            {moment.utc(value.createdAt).local().format("YYYY-MMM-DD h:mm A")}
                        </p>
                        <p>
                            <b>Issued by: </b>
                            {value.issuedBy}
                        </p>
                        <p>
                            <b>Title: </b>
                            {value.title}
                        </p>
                        <p style={{ color: "blue" }}>
                            <a target="_blank" href={value.url}>
                                Download
                            </a>
                        </p>
                    </div>
                </>
            )}

            <p className="credit text-center mt-9">
                This project is developed by{" "}
                <a
                    className="text-cyan-700 font-bold"
                    href="https://www.linkedin.com/in/sachanayush47/"
                    target="_blank"
                >
                    Ayush Sachan
                </a>
            </p>
        </div>
    );
};

export default App;
