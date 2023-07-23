import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Certificate from "../models/Certificate.js";

const signUp = asyncHandler(async (req, res) => {
    const { name, username, password } = req.body;

    // Validate user input
    if (!(name && username && password)) {
        res.status(400);
        throw new Error("All inputs are required");
    }

    // Check if user already exist, validate if user exist in our database
    const oldUser = await User.findOne({ username });

    if (oldUser) {
        res.status(400);
        throw new Error("Account already exist, please login");
    }
    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
        name,
        username,
        password: encryptedPassword,
    });

    // Return new user
    res.status(201).json(user);
});

const signIn = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) throw new Error("All inputs are required");

    // Validate if user exist in our database
    const user = await User.findOne({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN_KEY, { expiresIn: "24h" });
        user.password = undefined;
        res.cookie("access_token", token, {
            maxAge: 90 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: true, // TODO: In production, set it to true.
        })
            .status(200)
            .json(user);
        return;
    } else {
        res.status(401);
        throw new Error("Invalid credentials");
    }
});

const signOut = asyncHandler(async (req, res) => {
    res.clearCookie("access_token", { sameSite: "none", secure: true }).status(200).json();
});

const getUser = asyncHandler(async (req, res) => {
    const user = req.user;
    const totalIssuedCertificate = await Certificate.countDocuments({
        issuedBy: user.username,
    });

    const newUser = { name: user.name, credit: user.credit, totalIssuedCertificate };
    res.status(200).json(newUser);
});

export { signUp, signIn, signOut, getUser };
