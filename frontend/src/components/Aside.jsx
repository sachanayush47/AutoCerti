import React, { useState, useRef, useEffect } from "react";
import * as xlsx from "xlsx";
import axios from "axios";

import { notifyError } from "../utils/toastify";

const Aside = ({ imageURL, setImageURL, top, left, size }) => {
    const [excelData, setExcelData] = useState();

    const [title, setTitle] = useState();
    const [height, setHeight] = useState(635);
    const [width, setWidth] = useState(900);
    const [paddingTop, setPaddingTop] = useState(0);
    const [paddingBottom, setPaddingBottom] = useState(0);
    const [paddingLeft, setPaddingLeft] = useState(0);
    const [paddingRight, setPaddingRight] = useState(0);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const imageInputRef = useRef();
    const excelInputRef = useRef();

    useEffect(() => {
        const qlContainer = document.getElementsByClassName("ql-container")[0];
        qlContainer.style.background = `url(${imageURL})`;
        qlContainer.style.backgroundSize = "contain";
        qlContainer.style.backgroundRepeat = "no-repeat";
        qlContainer.style.height = `${height}px`;
        qlContainer.style.width = `${width}px`;
        qlContainer.style.paddingTop = `${paddingTop}px`;
        qlContainer.style.paddingBottom = `${paddingBottom}px`;
        qlContainer.style.paddingLeft = `${paddingLeft}px`;
        qlContainer.style.paddingRight = `${paddingRight}px`;
    }, [height, width, paddingTop, paddingBottom, paddingLeft, paddingRight, imageURL]);

    const print = async () => {
        const htm = document.getElementsByClassName("ql-editor")[0].innerHTML;
        console.log(htm);
        try {
            await axios.post("http://localhost:4000/api/pdf/screenshot", {
                htm: JSON.stringify(htm),
                excelData,
                imageURL,
                height,
                width,
                email,
                password,
                title,
                paddingTop,
                paddingBottom,
                paddingLeft,
                paddingRight,
                top,
                left,
                size,
            });
        } catch (error) {
            notifyError(error.response.data.err);
        }
    };

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImageURL(reader.result);
        };
    };

    const readUploadFile = (e) => {
        console.log("ex");
        e.preventDefault();

        if (e.target.files) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                setExcelData(json);
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    };

    return (
        <>
            <input type="checkbox" id="menu-open" className="hidden" />

            <header
                className="bg-gray-800 text-gray-100 flex justify-between md:hidden"
                data-dev-hint="mobile menu bar"
            >
                <a
                    href="#"
                    className="block ml-8 p-4 text-white font-bold whitespace-nowrap truncate"
                >
                    Toolbar
                </a>

                <label
                    for="menu-open"
                    id="mobile-menu-button"
                    className="m-2 p-2 mr-3 focus:outline-none hover:text-white hover:bg-gray-700 rounded-md"
                >
                    <svg
                        id="menu-open-icon"
                        className="h-6 w-6 mr-0 transition duration-200 ease-in-out"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                    <svg
                        id="menu-close-icon"
                        className="h-6 w-6 transition duration-200 ease-in-out"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </label>
            </header>
            <aside
                id="sidebar"
                className="z-50 bg-blue-900 text-gray-100 w-36 space-y-6 pt-2 px-0 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out  md:flex md:flex-col md:justify-between"
                data-dev-hint="sidebar; px-0 for frameless; px-2 for visually inset the navigation"
            >
                <div
                    className="flex flex-col space-y-6"
                    data-dev-hint="optional div for having an extra footer navigation"
                >
                    <nav data-dev-hint="main navigation" className="user-card">
                        <div className="mb-3 pt-0 mx-3">
                            <input
                                onChange={(e) => setTitle(e.target.value)}
                                type="text"
                                placeholder="Title"
                                className="px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                        </div>
                        <div className="mb-3 pt-0 mx-3">
                            <div
                                className="width"
                                style={{
                                    fontSize: "small",
                                    marginBottom: "2px",
                                }}
                            >
                                Width
                            </div>
                            <input
                                onChange={(e) => setWidth(e.target.value)}
                                type="number"
                                defaultValue={900}
                                placeholder="Width"
                                className="px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                        </div>
                        <div className="mb-3 pt-0 mx-3">
                            <div
                                className="height"
                                style={{
                                    fontSize: "small",
                                    marginBottom: "2px",
                                }}
                            >
                                Height
                            </div>
                            <input
                                onChange={(e) => setHeight(e.target.value)}
                                type="number"
                                defaultValue={635}
                                placeholder="Height"
                                className="px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                        </div>
                        <div className="mb-3 pt-0 mx-3">
                            <div
                                className="height"
                                style={{
                                    fontSize: "small",
                                    marginBottom: "2px",
                                }}
                            >
                                P-Top
                            </div>
                            <input
                                onChange={(e) => setPaddingTop(e.target.value)}
                                type="number"
                                defaultValue={0}
                                placeholder="P-Top"
                                className="px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                        </div>
                        <div className="mb-3 pt-0 mx-3">
                            <div
                                className="height"
                                style={{
                                    fontSize: "small",
                                    marginBottom: "2px",
                                }}
                            >
                                P-Bottom
                            </div>
                            <input
                                onChange={(e) => setPaddingBottom(e.target.value)}
                                type="number"
                                defaultValue={0}
                                placeholder="P-Bottom"
                                className="px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                        </div>
                        <div className="mb-3 pt-0 mx-3">
                            <div
                                className="height"
                                style={{
                                    fontSize: "small",
                                    marginBottom: "2px",
                                }}
                            >
                                P-Left
                            </div>
                            <input
                                onChange={(e) => setPaddingLeft(e.target.value)}
                                type="number"
                                placeholder="P-Left"
                                defaultValue={0}
                                className="px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                        </div>
                        <div className="mb-3 pt-0 mx-3">
                            <div
                                className="height"
                                style={{
                                    fontSize: "small",
                                    marginBottom: "2px",
                                }}
                            >
                                P-Right
                            </div>
                            <input
                                onChange={(e) => setPaddingRight(e.target.value)}
                                type="number"
                                placeholder="P-Right"
                                defaultValue={0}
                                className="px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                        </div>
                        <hr />
                        <div className="mt-3"></div>
                        <div className="mb-3 pt-0 mx-3">
                            <button
                                onClick={print}
                                className="bg-blue-500 w-full text-white active:bg-blue-600 font-bold uppercase text-base px-6 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Print
                            </button>
                        </div>
                        <hr />

                        <div className="mt-3 mb-3 pt-0 mx-3">
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                placeholder="Email"
                                className="px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                        </div>
                        <div className="mb-3 pt-0 mx-3">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Password"
                                className="px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                        </div>
                        <hr />

                        <div className="mt-3 mb-3 pt-0 mx-3">
                            <button
                                onClick={() => imageInputRef.current.click()}
                                className="bg-blue-500 w-full text-white active:bg-blue-600 font-bold uppercase text-base px-6 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Template
                            </button>
                        </div>
                        <div className="mb-3 pt-0 mx-3">
                            <button
                                onClick={() => excelInputRef.current.click()}
                                className="bg-blue-500 w-full text-white active:bg-blue-600 font-bold uppercase text-base px-6 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Excel
                            </button>
                        </div>
                    </nav>
                </div>

                <nav data-dev-hint="second-main-navigation or footer navigation">
                    <input
                        ref={imageInputRef}
                        type="file"
                        style={{ display: "none" }}
                        required
                        onChange={handleImageSelect}
                    />
                    <input
                        ref={excelInputRef}
                        style={{ display: "none" }}
                        required
                        type="file"
                        onChange={readUploadFile}
                    />
                </nav>
            </aside>
        </>
    );
};

export default Aside;
