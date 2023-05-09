import express from "express";
const router = express.Router();

import { verifyUser } from "../middleware/authHandler.js";
import { generatePdf, getHistory, verifyCertificate } from "../controllers/pdfController.js";

router.post("/screenshot", verifyUser, generatePdf);
router.post("/history", verifyUser, getHistory);
router.get("/verify/:id", verifyCertificate);

export default router;
