import { Request, Response, NextFunction } from "express";


export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        console.log("User in request:");
        const user = req.user as any;
        console.log("User in request:", user);
        console.log("Allowed roles:", allowedRoles);
        if (!user || !allowedRoles.includes(user.role)) {
            res.status(403).json({
                message: "Forbidden: you do not have permission for this resource",
            });
        }
        next();
    };
};