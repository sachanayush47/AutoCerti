import React, { useEffect, useState } from "react";
import { notifyError } from "../utils/toastify";
import axios from "axios";
import moment from "moment";

const History = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get("/pdf/history");
                console.log(res.data.message);
                setData(res.data.message);
            } catch (error) {
                notifyError(error.response.data.err);
            }
        };

        getData();
    }, []);

    return (
        <>
            <div className="table_">
                <table>
                    <thead>
                        <tr className="title_tb">
                            <th>ID</th>
                            <th>Date</th>
                            <th>URL</th>
                            <th>Title</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d) => {
                            return (
                                <tr className="odd">
                                    <td>{d._id}</td>
                                    <td>
                                        {moment
                                            .utc(d.createdAt)
                                            .local()
                                            .format("YYYY-MMM-DD h:mm A")}
                                    </td>
                                    <td>
                                        <a style={{ color: "blue" }} target="_blank" href={d.url}>
                                            Download
                                        </a>
                                    </td>
                                    <td>{d.title}</td>
                                    <td>{d.email}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default History;
