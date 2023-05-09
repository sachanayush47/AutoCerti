import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const verifyUser = asyncHandler(async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        res.status(401);
        throw new Error("It appears that you are not logged in.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) throw new Error();
        else req.user = user;
    } catch (error) {
        res.status(403);
        throw new Error("Invalid token, please logout and login again.");
    }

    next();
});
