import type { Request, Response } from "express";
import { User } from "../../models/user.models";
import {
    registerUserSchema,
    loginSchema,
} from "../../validators/user.validator";
import type { RegisterUser, LoginUser } from "../../validators/user.validator";
import { validateDto } from "../../utils/validateDto";
import { generateToken } from "../../utils/jwt";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import type { Types } from "mongoose";
import { cookieOptions } from "../../constants/cookies.constants";

// register user
const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const data = validateDto<RegisterUser>(registerUserSchema, req.body);

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) throw new ApiError(400, "Email already exists!");

    const user = await User.create(data);

    return new ApiResponse(201, user, "User Registered Successfully!").send(
        res
    );
});

//login user
const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const data = validateDto<LoginUser>(loginSchema, req.body);

    const user = await User.findOne({ email: data.email }).select("+password");
    if (!user) throw new ApiError(400, "User not found");

    const passMatch = await user.comparePassword(data.password);
    if (!passMatch) throw new ApiError(400, "Password is wrong");

    const token = generateToken((user._id as Types.ObjectId).toString());
    const safeUser = await User.findById(user._id).select("-password");

    res.cookie("token", token, cookieOptions);
    return new ApiResponse(200, { user: safeUser }, "Login success").send(res);
});

// logout user
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("token", { ...cookieOptions, maxAge: 0 });

    return new ApiResponse(200, {}, "Logout successfully!").send(res);
});

export { registerUser, loginUser, logoutUser };
