import express, { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
} from "../controllers/v1/user.controller";
import { verifyJWT } from "../middlewares/v1/auth.middleware";

const router = Router();

// register user

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

export default router;
