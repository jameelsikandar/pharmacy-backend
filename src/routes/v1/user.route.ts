import express, { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
} from "../../controllers/v1/user.controller";
import { authGuard } from "../../middlewares/v1/auth.guard";
import { upload } from "../../middlewares/shared/multer.middleware";

const router = Router();

// register user

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(authGuard, logoutUser);

export default router;
