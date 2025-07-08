import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { models } from "../db";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv"

dotenv.config();

const { User } = models;

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ where: { email } });
                if (!user) {
                    return done(null, false, { message: "User not found" });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: "Invalid password" });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        async (jwtPayload, done) => {
            console.log("JWT payload:", jwtPayload);
            try {
                const user = await User.findByPk(jwtPayload.id);
                console.log("User lookup result:", user);
                if (!user) {
                    return done(null, false, { message: "User not found." });
                }
                console.log("User found. Proceeding...");
                return done(null, user);
            } catch (e) {
                console.error("Error in JWT strategy:", e);
                return done(e, false);
            }
        }
    )
);

export default passport;
