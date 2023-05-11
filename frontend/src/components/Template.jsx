import React from "react";

import temp1 from "../assets/temp1.png";
import temp2 from "../assets/temp2.png";
import temp3 from "../assets/temp3.png";
import temp4 from "../assets/temp4.png";

const Template = ({ setImageURL }) => {
    return (
        <div
            className="bg-blue-900"
            id="carousel"
            style={{ height: "270px", width: "100%", padding: "10px" }}
        >
            <div onClick={() => setImageURL(temp1)} className="slide mr-4">
                <img style={{ height: "250px" }} src={temp1} />
            </div>
            <div onClick={() => setImageURL(temp2)} className="slide mr-4">
                <img style={{ height: "250px" }} src={temp2} />
            </div>
            <div onClick={() => setImageURL(temp3)} className="slide mr-4">
                <img style={{ height: "250px" }} src={temp3} />
            </div>
            <div onClick={() => setImageURL(temp4)} className="slide mr-4">
                <img style={{ height: "250px" }} src={temp4} />
            </div>
        </div>
    );
};

export default Template;
