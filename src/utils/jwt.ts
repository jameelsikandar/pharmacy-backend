import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { ENV } from "../config/env.config";
import { ApiError } from "./ApiError";

const JWT_SECRET = ENV.JWT_SECRET || "supersecretkey";
const JWT_EXPIRES_IN = ENV.JWT_EXPIRES_IN;

interface CustomJwtPayload extends JwtPayload {
    id: string;
}

const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
};

const verifyToken = (token: string): CustomJwtPayload => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "string") {
            throw new Error("Invalid token payload: string instead of object");
        }

        return decoded as CustomJwtPayload;
    } catch (error) {
        throw new ApiError(400, `Token verification failed`);
    }
};

export { generateToken, verifyToken };
