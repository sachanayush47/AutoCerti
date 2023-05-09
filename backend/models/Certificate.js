import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
    {
        issuedBy: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
