import mongoose, { Schema } from "mongoose";
import type { IUser } from "../types/models/IUser";
import bcrypt from "bcryptjs";

const userSchema = new Schema<IUser>(
    {
        fullName: {
            type: String,
            required: true,
        },
        avatar: {
            public_id: { type: String },
            secure_url: { type: String },
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// hash the password before saving in db
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// compare password with hash one in db
userSchema.methods.comparePassword = async function (
    this: IUser,
    candidatePassword: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.log("Password comparision failed! ", error);
        return false;
    }
};

export const User = mongoose.model<IUser>("User", userSchema);
