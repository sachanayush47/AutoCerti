import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";

const modules = {
    toolbar: false,
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

const Print = () => {
    const [value, setValue] = useState("");

    return (
        <div className="editor">
            <ReactQuill
                modules={modules}
                theme="snow"
                value={value}
                format={formats}
                onChange={setValue}
            />
        </div>
    );
};

export default Print;
