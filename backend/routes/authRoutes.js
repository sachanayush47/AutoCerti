import express from "express";

import { signIn, signUp, signOut } from "../controllers/authController.js";

const router = express.Router();

router.post("/create-account", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);

export default router;
