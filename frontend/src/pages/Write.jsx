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
        ["bold", "italic", "underline", "image"],
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
    "image",
];

const Write = () => {
    const [value, setValue] = useState(
        "<p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><p class='ql-align-center'><br></p><h1 class='ql-align-center'><strong>{NAME}</strong></h1><p class='ql-align-center'>_______________________________________________</p><p class='ql-align-center'><br></p><p class='ql-align-center'><strong>for his/her active participation during the conduct of this event held on XYZ (date) organized by the University Institute of Engineering and Technology, Kurukshetra University, Kurukshetra</strong></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p class='ql-align-center'> <strong style='color: rgb(136, 136, 136);'>Certificate ID: {ID}</strong></p>"
    );

    const [imageURL, setImageURL] = useState(temp4);

    return (
        <div>
            <hr />
            <Template setImageURL={setImageURL} />
            <div className="relative md:flex" data-dev-hint="container">
                <Aside imageURL={imageURL} setImageURL={setImageURL} />

                <main id="content" className="flex p-1">
                    <div className="editor">
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
