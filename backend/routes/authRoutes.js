import express from "express";
import { verifyUser } from "../middleware/authHandler.js";
import { signIn, signUp, signOut, getUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/create-account", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);
router.get("/user-details", verifyUser, getUser);

export default router;
