export class ApiError extends Error {
    public statusCode: number;
    public errors?: unknown[];
    public override stack?: string;

    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors?: unknown[],
        stack?: string
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors || [];

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
