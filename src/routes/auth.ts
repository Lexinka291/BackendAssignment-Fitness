import {models} from '../db'
import * as dotenv from "dotenv";
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

dotenv.config();

const bcrypt = require("bcrypt");

const {
    User
} = models

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ where: { email } })
                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' })
                }

                const isValid = await bcrypt.compare(password, user.password)
                if (!isValid) {
                    return done(null, false, { message: 'Incorrect password.' })
                }

                return done(null, user)
            } catch (err) {
                return done(err)
            }
        }
    )
)

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(
    new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
            const user = await User.findByPk(jwt_payload.id)
            if (!user) {
                return done(null, false)
            }
            return done(null, user)
        } catch (err) {
            return done(err, false)
        }
    })
)
