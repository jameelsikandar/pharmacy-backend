import { ENV } from "../config/env.config";

// Cookie options for reusability
export const COOKIE_OPTIONS = {
    httpOnly: false,
    secure: ENV.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const ALLOWED_IMAGE_TYPES = /jpeg|jpg|png|webp|heic|heif/;
