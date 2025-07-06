import {Router, Request, Response, NextFunction, raw} from 'express'

import {models} from '../db'
import passport from "passport";

const bcrypt = require("bcrypt");
import jwt from 'jsonwebtoken'
import * as passportLocal from "passport-local";
import {authorizeRoles} from "../middleware/authRoles";
import {USER_ROLES} from "../utils/enums";
import {compare} from "bcrypt";


const router = Router()

const {
    User,
    Exercise,
    Program
} = models

export default () => {

    router.get(
        '/users',
        passport.authenticate("jwt", {session: false}),
        authorizeRoles(USER_ROLES.ADMIN),
        async (req, res) => {
            const users = await User.findAll();
            res.json({
                data: users,
                message: "List of users",
            });
        }
    );
    router.post(
        '/exerciseAdd',
        passport.authenticate('jwt', {session: false}),
        authorizeRoles(USER_ROLES.ADMIN),
        async (req, res) => {
            try {
                const {name, difficulty, programID} = req.body
                const exercise = await Exercise.create({name, difficulty, programID})
                res.json({
                    data: exercise,
                    message: 'Exercise created successfully'
                })
            } catch (err: any) {
                console.error(err)
                res.status(500).json({
                    message: 'Error creating new exercise',
                    error: err.message
                })
            }
        }
    )
    router.post(
        '/exercise/add',
        passport.authenticate('jwt', { session: false }),
        authorizeRoles(USER_ROLES.ADMIN),
        async (req, res): Promise<void> => {
            try {
                const { name, difficulty, programID } = req.body;

                // const program = await Program.findByPk(programID);
                // if (!program) {
                //     res.status(400).json({
                //         message: 'Program not found.',
                //     });
                //     return;
                // }
                //
                // const existingExercise = await Exercise.findOne({
                //     where: {
                //         name,
                //         programId: programID,
                //     },
                // });
                //
                // if (existingExercise) {
                //     res.status(400).json({
                //         message: 'Exercise with same name and program already exists!',
                //     });
                //     return;
                // }

                const exercise = await Exercise.create({
                    name,
                    difficulty,
                    programId: programID,
                });

                res.status(201).json({
                    data: exercise,
                    message: 'Exercise created successfully',
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    message: 'Error creating new exercise',
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        }
    );
    router.post(
        '/exercise/delete',
        passport.authenticate('jwt', {session: false}),
        authorizeRoles(USER_ROLES.ADMIN),
        async (req, res) => {
            try {
                const {name} = req.body
                const exercise = await Exercise.findOne({where: name})
                if (exercise) {
                    const count = await Exercise.destroy({where: name})
                    if (count > 0) {
                        res.json({message: `Deleted excercise ${name}`})
                    } else {
                        res.status(404).json({message: 'User not found'})
                    }

                }
            } catch (err: any) {
                console.error(err)
                res.status(500).json({
                    message: 'Error creating new exercise',
                    error: err.message
                })
            }
        }
    )


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