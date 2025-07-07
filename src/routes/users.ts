import {Router, Request, Response, NextFunction} from 'express'

import {models} from '../db'
import passport from "passport";

const bcrypt = require("bcrypt");
import jwt from 'jsonwebtoken'
import * as passportLocal from "passport-local";
import {authorizeRoles} from "../middleware/authRoles"
import {USER_ROLES} from "../utils/enums"


const router = Router()

const {
    User
} = models

export default () => {


    router.post('/register',
        async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
        const {name, surname, nickName, email, password, age, role} = req.body

        try {
            let user = await User.findOne({where: {nickName}})
            if (user) {
                return res.status(400).json({message: `User with the same nickname already exists`})
            }
            user = await User.findOne({where: {email}})
            if (user) {
                return res.status(400).json({message: `User with the same email already exists`})
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const newUser = await User.create({
                name,
                surname,
                nickName,
                email,
                password: hashedPassword,
                age,
                role
            })

            return res.status(201).json({
                id: newUser.id,
                name: newUser.name,
                surname: newUser.surname,
                nickName: newUser.nickName,
                email: newUser.email,
                age: newUser.age,
                role: newUser.role
            })

        } catch (err: any) {
            console.error(err)
            return res.status(500).json({message: 'Error creating user', error: err.message})
        }
    })

    router.post(
        '/login',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email, password } = req.body

                const user = await User.findOne({ where: { email } })
                if (!user) {
                     res.status(401).json({ message: 'Invalid credentials' })
                }

                const match = await bcrypt.compare(password, user.password)
                if (!match) {
                     res.status(401).json({ message: 'Invalid credentials' })
                }

                const token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    },
                    "secret",
                    { expiresIn: '1h' }
                )

                 res.json({ token })
            } catch (err) {
                console.error(err)
                next(err)
            }
        }
    )


    router.get(
        '/',
        (req, res, next) => {
            passport.authenticate("jwt", { session: false }, (err:any, user:any, info:any) => {
                if (err) {
                    console.error("Passport error:", err);
                    return res.status(500).json({ message: "Internal server error." });
                }
                if (!user) {
                    console.log("JWT auth failed:", info);
                    return res.status(401).json({ message: "Unauthorized." });
                }
                console.log("JWT auth success:", user);
                req.user = user;
                next();
            })(req, res, next);
        },
        async (req, res) => {
            console.log("Route handler running...");
            const users = await User.findAll();
            res.json({
                data: users,
                message: "List of users",
            });
        }
    );
    router.delete(
        '/delete/:email',
        async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
            const email = req.params.email

            try {
                const count = await User.destroy({
                    where: {email}
                })

                if (count > 0) {
                    return res.json({message: `Deleted user ${email}`})
                } else {
                    return res.status(404).json({message: 'User not found'})
                }
            } catch (err) {
                console.error(err)
                return res.status(500).json({message: 'Error deleting user'})
            }
        }
    )

    return router
}