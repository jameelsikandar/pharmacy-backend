import mongoose, { Schema } from "mongoose";
import type { IClient } from "../types/models/IClient";

const clientSchema = new Schema<IClient>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        contact: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        avatar: {
            public_id: { type: String },
            secure_url: { type: String },
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
            unique: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Client = mongoose.model<IClient>("Client", clientSchema);
