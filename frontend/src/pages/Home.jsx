import React from "react";
import Footer from "../components/Footer";
import temp2 from "../assets/temp2.png";
import temp4 from "../assets/temp4.png";
import { Link } from "react-router-dom";

const templates = [
    {
        temp: temp2,
        id: 1,
        content:
            '<p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p class="ql-align-center"><strong style="color: rgb(0, 102, 204);" class="ql-size-huge">{NAME}</strong></p><p><br></p><p><br></p><p><br></p><p><span class="ql-size-large"> </span></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p class="ql-align-center">Certificate ID: {ID}</p>',
    },
    {
        temp: temp4,
        id: 2,
        content:
            '<p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><h1 class="ql-align-center"><strong>{NAME}</strong></h1><p class="ql-align-center">_______________________________________________</p><p class="ql-align-center"><br></p><p class="ql-align-center"><strong>for his/her active participation during the conduct of this event held on XYZ (date) organized by the University Institute of Engineering and Technology, Kurukshetra University, Kurukshetra</strong></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p class="ql-align-center"><strong style="color: rgb(136, 136, 136);">Certificate ID: {ID}</strong></p>',
    },
];

const Home = () => {
    return (
        <>
            <div>
                <section class="bg-slate-100">
                    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                        <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">
                            Auto<span className="text-blue-800">Certi</span>
                        </h1>
                        <p class="mb-8 text-lg font-normal text-gray-800 lg:text-xl sm:px-16 xl:px-48">
                            Certificate management, generation, distribution and verification made
                            easy
                        </p>
                        <div>
                            <a
                                href="https://youtu.be/vSoFEnWN1kA"
                                target="_blank"
                                class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg hover:bg-blue-700
                        bg-blue-800"
                            >
                                <svg
                                    class="mr-2 -ml-1 w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                                </svg>
                                Watch Demo Video
                            </a>
                        </div>
                    </div>
                </section>
                <div>
                    <div class="text-center my-8">
                        <Link
                            to="/write"
                            class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg hover:bg-blue-700
                        bg-blue-800"
                        >
                            Start from your own template
                        </Link>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-400">OR</p>
                    </div>
                    <div className="mx-auto grid w-full max-w-7xl justify-center space-y-4 px-2 py-10 md:grid-cols-2 md:gap-6 md:space-y-0">
                        {templates.map((temp) => (
                            <Link
                                to="write"
                                state={temp}
                                key={temp.id}
                                className="relative aspect-[16/9]  w-auto rounded-md md:aspect-auto md:h-[400px]"
                            >
                                <img
                                    src={temp.temp}
                                    alt="AirMax Pro"
                                    className="z-0 h-full w-full rounded-md object-cover"
                                />
                                <div className="absolute inset-0 rounded-md bg-gradient-to-t from-gray-900 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-left">
                                    <h1 className="text-lg font-semibold text-white">
                                        Template {temp.id}
                                    </h1>
                                    {/* <p className="mt-2 text-sm text-gray-300">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                    Excepturi, debitis?
                                </p> */}
                                    {/* <button className="mt-2 inline-flex cursor-pointer items-center text-sm font-semibold text-white">
                                    SELECT &rarr;
                                </button> */}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Home;
