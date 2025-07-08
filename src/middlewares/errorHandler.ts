import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    console.error(err);

    const logPath = path.join(__dirname, "../logs/error.log");
    fs.appendFileSync(
        logPath,
        `[${new Date().toISOString()}] ${err.stack || err.message}\n`
    );

    res.status(500).json({
        data: {},
        message: "Something went wrong",
    });
};
