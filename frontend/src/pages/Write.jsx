import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import { useLocation } from "react-router-dom";

import qrcode from "../assets/qrcode.png";
import Aside from "../components/Aside";

const modules = {
    toolbar: [
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: 1 }, { header: 2 }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ["clean"],
    ],
};

const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "align",
    "color",
    "background",
];

const Write = () => {
    const state = useLocation().state;

    const [value, setValue] = useState(state ? state.content : "");

    // Background image (template)
    const [imageURL, setImageURL] = useState(state ? state.temp : null);

    // For PhotoID
    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);
    const [size, setSize] = useState(200);

    // For QR Code
    const [qrTop, setQrTop] = useState(0);
    const [qrLeft, setQrLeft] = useState(0);
    const [qrSize, setQrSize] = useState(200);

    useEffect(() => {
        const photoid = document.getElementById("photoid");
        console.log("before");
        if (!photoid) return;
        console.log("after");

        photoid.style.top = `${top}px`;
        photoid.style.left = `${left}px`;
        photoid.style.height = `${size}px`;
        photoid.style.width = `${size}px`;
    }, [top, left, size]);

    useEffect(() => {
        const qrcodeImg = document.getElementById("qrcode");

        if (!qrcodeImg) return;

        qrcodeImg.style.top = `${qrTop}px`;
        qrcodeImg.style.left = `${qrLeft}px`;
        qrcodeImg.style.height = `${qrSize}px`;
        qrcodeImg.style.width = `${qrSize}px`;
    }, [qrTop, qrLeft, qrSize]);

    const setPhotoId = () => {
        let i = document.createElement("img");
        i.setAttribute("id", "photoid");
        i.setAttribute("referrerpolicy", "no-referrer");
        i.src = "https://lh3.googleusercontent.com/d/1AZte8vCseSWM2smRMIYDBjnPgxRgS_1q";
        const qlContainer = document.getElementsByClassName("ql-editor")[0];
        qlContainer.appendChild(i);
    };

    const setQrCode = () => {
        let i = document.createElement("img");
        i.setAttribute("id", "qrcode");
        i.src = qrcode;
        const qlContainer = document.getElementsByClassName("ql-editor")[0];
        qlContainer.appendChild(i);
    };

    return (
        <div>
            <div id="small-screen-tool"><p className="text-center p-10 mt-40 text-xl">This page is not supported on small screen</p>
            </div>
            <div id="tool" className="relative md:flex" data-dev-hint="container">
                <Aside imageURL={imageURL} setImageURL={setImageURL} />

                <main id="content" className="flex flex-col p-1">
                    <div className="editor">
                        <div className="flex mb-1">
                            <input
                                onChange={(e) => setTop(e.target.value)}
                                type="number"
                                placeholder="Top"
                                className="mr-1 px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                            <input
                                onChange={(e) => setLeft(e.target.value)}
                                type="number"
                                placeholder="Left"
                                className="mr-1 px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                            <input
                                onChange={(e) => setSize(e.target.value)}
                                type="number"
                                placeholder="Size"
                                className="mr-1 px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                            <button
                                onClick={setPhotoId}
                                className="bg-blue-500 w-full text-white active:bg-blue-600 font-bold uppercase text-base px-6 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Set Photo ID
                            </button>
                        </div>

                        {/* QR Code */}
                        <div className="flex mb-1">
                            <input
                                onChange={(e) => setQrTop(e.target.value)}
                                type="number"
                                placeholder="Top"
                                className="mr-1 px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                            <input
                                onChange={(e) => setQrLeft(e.target.value)}
                                type="number"
                                placeholder="Left"
                                className="mr-1 px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                            <input
                                onChange={(e) => setQrSize(e.target.value)}
                                type="number"
                                placeholder="Size"
                                className="mr-1 px-3 py-3 placeholder-slate-400 text-black relative bg-white rounded-sm text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            />
                            <button
                                onClick={setQrCode}
                                className="bg-blue-500 w-full text-white active:bg-blue-600 font-bold uppercase text-base px-6 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                            >
                                Set QR Code
                            </button>
                        </div>
                        <ReactQuill
                            modules={modules}
                            theme="snow"
                            value={value}
                            format={formats}
                            onChange={setValue}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Write;
