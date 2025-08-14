import mongoose, { Schema } from "mongoose";
import type { IClient } from "../types/models/IClient";

const clientSchema = new Schema<IClient>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },
    },
    {
        timestamps: true,
    }
);

export const Client = mongoose.model<IClient>("Client", clientSchema);
