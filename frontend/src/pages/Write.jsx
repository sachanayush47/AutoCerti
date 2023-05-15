import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";

import Template from "../components/Template";

import temp4 from "../assets/temp4.png";
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
    const [value, setValue] = useState(
        "<p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><h1 class='ql-align-center'><strong>{NAME}</strong></h1><p class='ql-align-center'>_______________________________________________</p><p class='ql-align-center'><br></p><p class='ql-align-center'><strong>for his/her active participation during the conduct of this event held on XYZ (date) organized by the University Institute of Engineering and Technology, Kurukshetra University, Kurukshetra</strong></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p class='ql-align-center'> <strong style='color: rgb(136, 136, 136);'>Certificate ID: {ID}</strong></p>"
    );

    const [imageURL, setImageURL] = useState(temp4);
    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);
    const [size, setSize] = useState(200);

    useEffect(() => {
        const photoid = document.getElementById("photoid");

        if (!photoid) return;

        photoid.style.top = `${top}px`;
        photoid.style.left = `${left}px`;
        photoid.style.height = `${size}px`;
        photoid.style.width = `${size}px`;
    }, [top, left, size]);

    const setPhotoId = () => {
        let i = document.createElement("img");
        i.setAttribute("id", "photoid");
        i.setAttribute("referrerpolicy", "no-referrer");
        i.src = "https://lh3.googleusercontent.com/d/1LDyDOnA4voFH42Z2dmWveMK1L3HKauxh";
        const qlContainer = document.getElementsByClassName("ql-editor")[0];
        console.log(i);
        qlContainer.appendChild(i);
    };

    return (
        <div>
            <hr />
            <Template setImageURL={setImageURL} top={top} left={left} size={size} />
            <div className="relative md:flex" data-dev-hint="container">
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
