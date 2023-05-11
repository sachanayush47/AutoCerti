import axios from "axios";
import React from "react";
import { useState } from "react";
import { notifyError } from "../utils/toastify";
import moment from "moment";
import { Link } from "react-router-dom";

const Verify = () => {
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
            console.log(res.data.message);
        } catch (error) {
            setValue(null);
            notifyError(error.response.data.err);
        }
    };

    return (
        <>
            <div
                className="relative w-full mb-3 "
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "10%",
                }}
            >
                <label
                    className="block uppercase text-gray-800 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                    style={{ fontSize: "20px" }}
                >
                    Validate your certificate here
                </label>
                <input
                    onChange={setId}
                    type="text"
                    className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white  rounded text-sm shadow focus:outline-none focus:ring w-64"
                    placeholder="Unique Certificate ID"
                    style={{
                        transition: "all .15s ease",
                        width: "30%",
                        border: "2px solid grey",
                        marginTop: "1%",
                    }}
                />
                <div className="mb-3 pt-0 mx-3">
                    <button
                        onClick={verifyCertificate}
                        className="mt-4 bg-blue-500 w-full text-white active:bg-blue-600 font-bold uppercase text-base px-6 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                    >
                        Verify
                    </button>
                    {/* <Link to="/bulk">
                        <button
                            className="mt-4 bg-blue-500 w-full text-white active:bg-blue-600 font-bold uppercase text-base px-6 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                            type="button"
                        >
                            Bulk Verify
                        </button>
                    </Link> */}
                </div>
            </div>

            {value && (
                <>
                    <div
                        className="data"
                        style={{
                            justifyContent: "center",
                            display: "flex",
                            flexDirection: "column",
                            /* align-items: center; */
                            width: " 50%",
                            /* border: 2px solid grey; */
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: "4%",
                            padding: "1% 4%",
                            background: " #b6cedd",
                            borderRadius: "6px",
                        }}
                    >
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
        </>
    );
};

export default Verify;
