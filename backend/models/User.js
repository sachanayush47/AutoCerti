import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        credit: {
            type: Number,
            default: 20,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
