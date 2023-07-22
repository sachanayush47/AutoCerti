import express from "express";
import { verifyUser } from "../middleware/authHandler.js";
import { buyCredits } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/buy-credits", verifyUser, buyCredits);

export default router;
