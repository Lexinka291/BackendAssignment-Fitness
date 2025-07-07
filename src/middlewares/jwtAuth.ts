import passport from "../config/passport";

export const jwtAuth = () => (req:any, res:any, next:any) => {
    passport.authenticate("jwt", { session: false }, (err:any, user:any, info:any) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error." });
        }
        if (!user) {
            return res.status(401).json({ message: "Unauthorized." });
        }
        req.user = user;
        next();
    })(req, res, next);
};
