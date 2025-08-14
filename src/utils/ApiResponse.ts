import type { Response } from "express";

class ApiResponse<T> {
    constructor(
        public statusCodes: number,
        public data: T,
        public message: string = "Success"
    ) {}

    send(res: Response) {
        return res.status(this.statusCodes).json({
            success: true,
            message: this.message,
            data: this.data,
        });
    }
}

export { ApiResponse };
