import app from "./app";
import { connectDb } from "./config/db.config";
import { ENV } from "./config/env.config";

const startServer = async () => {
    try {
        await connectDb();
        app.listen(ENV.PORT, () => {
            console.log(`Server started -- PORT ${ENV.PORT}`);
        });
    } catch (error) {
        console.log(`MongoDB connection error: `, error);
        process.exit(1);
    }
};

startServer();
