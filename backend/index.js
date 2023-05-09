import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pdfRoutes from "./routes/pdfRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import connection from "./config/db.js";

import dotenv from "dotenv";
dotenv.config();
connection();

// https://stackoverflow.com/questions/57373194/headless-chrome-not-detecting-css-and-background-image-of-the-webpage

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use("/api/pdf", pdfRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

app.listen(4000, () => console.log("Running " + 4000));
