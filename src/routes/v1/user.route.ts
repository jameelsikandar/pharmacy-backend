import express, { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    getUserProfile,
} from "../../controllers/v1/user.controller";
import { authGuard } from "../../middlewares/v1/auth.guard";
import { safeUpload } from "../../middlewares/shared/multer.middleware";

const router = Router();

// register user
router.route("/register").post(safeUpload, registerUser);

// login user
router.route("/login").post(loginUser);

// -------protected routes---------
//update user
router.route("/update").patch(authGuard, safeUpload, updateUser);

// get user profile
router.route("/profile").get(authGuard, getUserProfile);

// logout user
router.route("/logout").post(authGuard, logoutUser);

export default router;
