import express, { type Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.config';
import { globalErrorHandler } from './middlewares/shared/globalErrorHandler';
import userRouter from './routes/v1/user.route';
import medicineRouter from './routes/v1/medicine.route';
import supplierRouter from './routes/v1/supplier.route';

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
    }),
);

// user routes
app.use('/api/v1/user', userRouter);

// medicine route
app.use('/api/v1/medicines', medicineRouter);

// supplier routes
app.use('/api/v1/suppliers', supplierRouter);

app.use(globalErrorHandler);

export default app;
