import type { Request, Response } from "express";
import { User } from "../../models/user.models";
import {
    registerUserSchema,
    loginSchema,
    updateUserSchema,
} from "../../validators/user.validator";
import type {
    RegisterUser,
    LoginUser,
    UpdateUser,
} from "../../validators/user.validator";
import { validateDto } from "../../utils/validateDto";
import { generateToken } from "../../utils/jwt";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import type { Types } from "mongoose";
import { cookieOptions } from "../../constants/cookies.constants";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import fs from "fs";
import type { AuthenticatedRequest } from "../../types/shared/IAuthenticatedRequest";

// register user
const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const data = validateDto<RegisterUser>(registerUserSchema, req.body);

    if (req.file) {
        const response = await uploadToCloudinary(req.file.path);
        if (!response || !response.secure_url) {
            throw new ApiError(400, "Image uploading to Cloudinary failed!");
        }
        // console.log(response);
        data.avatar = {
            public_id: response.public_id,
            secure_url: response.secure_url,
        };

        fs.unlinkSync(req.file.path); // delete file from server
    }

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) throw new ApiError(400, "Email already exists!");

    const user = await User.create(data);

    return new ApiResponse(
        201,
        {
            fullName: user.fullName,
            avatar: user.avatar?.secure_url,
            email: user.email,
            contact: user.contact,
        },
        "User Registered Successfully!"
    ).send(res);
});

//login user
const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const data = validateDto<LoginUser>(loginSchema, req.body);

    const user = await User.findOne({ email: data.email });
    if (!user) throw new ApiError(400, "Invalid credentials");

    const passMatch = await user.comparePassword(data.password);
    if (!passMatch) throw new ApiError(400, "Invalid credentials");

    const token = generateToken((user._id as Types.ObjectId).toString());

    res.cookie("token", token, cookieOptions);
    return new ApiResponse(
        200,
        {
            Name: user.fullName,
            Email: user.email,
            Avatar: user.avatar?.secure_url,
            Contact: user.contact,
        },
        "Login success"
    ).send(res);
});

// update user

const updateUser = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const data = validateDto<UpdateUser>(updateUserSchema, req.body);

        const id = req.user?._id;

        if (!id) {
            throw new ApiError(401, "Unauthorized. Id not found!");
        }

        if (req.file) {
            const response = await uploadToCloudinary(req.file.path);
            if (!response || !response.secure_url) {
                throw new ApiError(
                    400,
                    "Image uploading to Cloudinary failed!"
                );
            }
            // console.log(response);
            data.avatar = {
                public_id: response.public_id,
                secure_url: response.secure_url,
            };

            fs.unlinkSync(req.file.path); // delete file from server
        }

        const user = await User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!user) {
            throw new ApiError(404, "User not found!");
        }

        return new ApiResponse(
            200,
            data,
            "Credentials updated successfully!"
        ).send(res);
    }
);

// logout user
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("token", { ...cookieOptions, maxAge: 0 });

    return new ApiResponse(200, {}, "Logout successfully!").send(res);
});

export { registerUser, loginUser, logoutUser, updateUser };
