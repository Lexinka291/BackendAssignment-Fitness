import { Request, Response, NextFunction } from "express";


export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user as any;
        if (!user || !allowedRoles.includes(user.role)) {
            res.status(403).json({
                message: "Forbidden: you do not have permission for this resource",
            });
        }
        next();
    };
};