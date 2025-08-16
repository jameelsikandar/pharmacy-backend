import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/ApiError';
import { ENV } from '../../config/env.config';

const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err instanceof ApiError ? err.message : 'Internal server error!';
    const errors = err instanceof ApiError ? err.errors : null;

    const stack = ENV.NODE_ENV === 'development' && err instanceof Error ? err.stack : undefined;

    res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};

export { globalErrorHandler };
