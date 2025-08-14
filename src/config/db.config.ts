import mongoose from "mongoose";
import { ENV } from "./env.config";

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(ENV.MONGO_URI);
        console.log(
            `DB Connected -- Host ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log("DB connection failed -- ", error);
        process.exit(1);
    }
};

export { connectDb };
