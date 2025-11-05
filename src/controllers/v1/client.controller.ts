import type { Response } from "express";
import type { AuthenticatedRequest } from "../../types/shared/IAuthenticatedRequest";
import type { AddClient, UpdateClient } from "../../validators/client.validator";
import { Client } from "../../models/client.model";
import { addClientSchema, updateClientSchema } from "../../validators/client.validator";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { validateDto } from "../../utils/validateDto";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import fs from "fs/promises";
import mongoose from "mongoose";

// get all medicines
const listClients = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const clients = await Client.find().sort({ createdAt: -1 });

    return new ApiResponse(200, clients, "Medicines fetched successfully!").send(res);
});

// add clients
const addClient = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validateDto<AddClient>(addClientSchema, req.body);

    const existingClient = await Client.findOne({
        $or: [
            {
                contact: data.contact,
            },
            {
                email: data.email,
            },
        ],
    });

    if (existingClient && req.file?.path) {
        await fs
            .unlink(req.file.path)
            .catch((err) => console.error(`Failed to delete file: ${err.message}`));
        throw new ApiError(409, "Client already exists");
    }

    if (req.file) {
        const response = await uploadToCloudinary(req.file.path);
        if (!response || !response.secure_url) {
            throw new ApiError(400, "Error while uploading image to cloudinary");
        }

        data.avatar = {
            public_id: response.public_id,
            secure_url: response.secure_url,
        };
    }

    try {
        const client = await Client.create(data);

        return new ApiResponse(
            201,
            {
                fullName: client.fullName,
                avatar: client.avatar?.secure_url,
                contact: client.contact,
                email: client.email,
            },
            "Client added successfully!",
        ).send(res);
    } catch (error: any) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            throw new ApiError(409, `${field} already exists`);
        }
        throw new ApiError(400, "Error while adding client");
    }
});

// update client
const updateClient = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { clientID } = req.params;
    const data = validateDto<UpdateClient>(updateClientSchema, req.body);

    if (!clientID || !mongoose.isValidObjectId(clientID)) {
        throw new ApiError(400, "Invalid client ID");
    }

    if (req.file) {
        const response = await uploadToCloudinary(req.file.path);
        if (!response || !response.secure_url) {
            throw new ApiError(400, "Error while uploading image");
        }

        data.avatar = {
            public_id: response.public_id,
            secure_url: response.secure_url,
        };
    }

    const updatedClient = await Client.findByIdAndUpdate(clientID, data, {
        new: true,
        runValidators: true,
    });

    if (!updatedClient) {
        throw new ApiError(404, "Error while updating client");
    }

    return new ApiResponse(
        200,
        {
            fullName: updatedClient.fullName,
            email: updatedClient.email,
            avatar: updatedClient.avatar?.secure_url,
            contact: updatedClient.contact,
        },
        "Client updated successfully!",
    ).send(res);
});

// get client
const getClient = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { clientID } = req.params;

    if (!clientID || !mongoose.isValidObjectId(clientID)) {
        throw new ApiError(400, "Invalid client ID");
    }

    const client = await Client.findById(clientID).lean();

    if (!client) {
        throw new ApiError(404, "Client not found");
    }

    return new ApiResponse(
        200,
        {
            fullName: client.fullName,
            email: client.email,
            avatar: client.avatar?.secure_url,
            contact: client.contact,
        },
        "Client fetched successfully!",
    ).send(res);
});

// delete client
const deleteClient = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { clientID } = req.params;

    if (!clientID || !mongoose.isValidObjectId(clientID)) {
        throw new ApiError(400, "Invalid client ID");
    }

    const client = await Client.findByIdAndDelete(clientID);

    if (!client) {
        throw new ApiError(404, "Client not found");
    }

    return new ApiResponse(
        200,
        {
            fullName: client.fullName,
            email: client.email,
            avatar: client.avatar?.secure_url,
            contact: client.contact,
        },
        "Client deleted successfully!",
    ).send(res);
});

export { addClient, updateClient, getClient, deleteClient, listClients };
