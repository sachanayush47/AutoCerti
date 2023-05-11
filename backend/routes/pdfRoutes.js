import express from "express";
const router = express.Router();

import { verifyUser } from "../middleware/authHandler.js";
import { generatePdf, getHistory, verifyCertificate } from "../controllers/pdfController.js";

router.post("/screenshot", verifyUser, generatePdf);
router.get("/history", verifyUser, getHistory);
router.get("/verify/:id", verifyCertificate);
router.get("/preview", verifyCertificate);

export default router;
