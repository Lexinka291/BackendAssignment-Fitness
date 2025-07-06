import passport from "passport";
import { Router } from "express";
import {models} from "../db";

const router = Router();
export default () => {


    router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        console.log("JWT auth worked:", req.user);
        res.json({ message: "JWT auth worked!", user: req.user });
    }
);


    return router
}