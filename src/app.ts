import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.config";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import userRouter from "./routes/user.route";
import medicineRouter from "./routes/medicine.route";

const app: Application = express();

// parse incoming requests -- json
app.use(express.json());

// parses application/form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parses cookies -- makes them accessible via req.cookies
app.use(cookieParser());

// cors middleware to only allow our frontend to connect
app.use(
    cors({
        origin: ENV.CORS_ORIGIN,
        credentials: true,
    })
);

app.use("/api/v1/users", userRouter);

//medicine route
app.use("/api/v1/medicines", medicineRouter);

app.use(globalErrorHandler);

export default app;
