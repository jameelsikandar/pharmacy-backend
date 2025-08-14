import type { Request, Response } from "express";
import { User } from "../../models/user.models";
import {
    registerUserSchema,
    loginSchema,
} from "../../validators/user.validator";
import { generateToken } from "../../utils/jwt";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import type { Types } from "mongoose";
import { ENV } from "../../config/env.config";
import type { ZodError } from "zod";
import { z } from "zod";

// Cookie options for reusability
const cookieOptions = {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const parsed = registerUserSchema.safeParse(req.body);

    if (!parsed.success) {
        const zodErrors = parsed.error as ZodError<
            z.infer<typeof registerUserSchema>
        >;
        const errors = zodErrors.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));

        throw new ApiError(400, "Validation failed", errors);
    }

    const { fullName, email, avatar, contact, password } = parsed.data;

    console.log(parsed.data);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(400, "Email already exists!");
    }

    const user = await User.create({
        fullName,
        avatar,
        email,
        password,
        contact,
    });

    return new ApiResponse(201, user, "User Registered Successfully!").send(
        res
    );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
        const zodErrors = parsed.error as ZodError<z.infer<typeof loginSchema>>;
        const errors = zodErrors.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));

        throw new ApiError(400, "Validation failed", errors);
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(400, "user not found");
    }

    const passMatch = await user.comparePassword(password);
    if (!passMatch) {
        throw new ApiError(400, "password is wrong");
    }

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
