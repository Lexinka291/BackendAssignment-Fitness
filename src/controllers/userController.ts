import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

import {models} from '../db'
import bcrypt from "bcrypt";
import {UserModel} from "../db/user";
import {getLocalizedMessage} from "../utils/localize";


const {
    User,
    ExerciseTracker,
    Exercise,
    Program
} = models

export const getPublicUsersInfo
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    // Get id and nickname
    const users = await User.findAll({
        attributes: ["id", "nickName"],
    });
    res.json({
        data: users,
        message: getLocalizedMessage(req, "publicUserList")
    })
}

export const getUsers
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    const users = await User.findAll();
    res.json({
        data: users,
        message: getLocalizedMessage(req, "userList")
    });
}
export const getUserByID =
    async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
        const {id} = req.params;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    message: getLocalizedMessage(req, "userNotFound"),
                });
            }
            const profileData = GetUserDetails(user)
            res.json({
                data: profileData,
                message: getLocalizedMessage(req, "userFound") + `: ${id}`,
            });        }
        catch (err) {
            _next(err);

        }
    };

function GetUserDetails(user: UserModel) {
    {
        const profileData= {
            name: user.name,
            surname: user.surname,
            nickName: user.nickName,
            age: user.age,
        }
        return profileData;
    }
}

export const getProfile
    = async (req: any, res: Response, _next: NextFunction): Promise<any> => {
    try {

    const userID = (req.user as any).id;
        // Get user data
        const user = await User.findByPk(userID);

        if (!user) {
            return res.status(404).json({
                message: getLocalizedMessage(req, "userNotFound"),
            });
        }

        const profileData = GetUserDetails(user);

        // Get all exercise trackers
        const trackers = await ExerciseTracker.findAll({
            where: {
                userID: userID
            },
            include: [
                {
                    model: Exercise,
                    attributes: ['name'],
                }
            ],
            attributes: [
                'id',
                'exerciseID',
                'completedAt',
                'durationSeconds'
            ]
        });

        // Map the trackers
        const completedExercises = trackers.map((tracker: any) => ({
            trackID: tracker.id,
            exerciseID: tracker.exerciseID,
            exerciseName: tracker.exercise?.name || null,
            completedAt: tracker.completedAt,
            durationSeconds: tracker.durationSeconds
        }));

        res.json({
            data: {
                profileData,
                completedExercises
            },
            message: getLocalizedMessage(req, "profileData")
        });
    } catch (err) {
        _next(err);

    }}

export const updateUserByID
    = async (req: any, res: Response, _next: NextFunction): Promise<any> => {
    async function GetReqBodyUpdates() {
        const updates: any = {};

        const allowedFields = [
            "name",
            "surname",
            "nickName",
            "email",
            "age",
            "role"
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }
        return updates;
    }
    try {
        const {id} = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: getLocalizedMessage(req, "userNotFound"),
            })
        }
        // Check the parameters to updates send by user
        const updates = await GetReqBodyUpdates()
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: getLocalizedMessage(req, "noFieldsToUpdate")
            });
        }
        // Perform the update
        await user.update(updates);

        res.json({
            data: user,
            message: getLocalizedMessage(req, "userUpdated") + `: ${id}`,
        });
    } catch (err) {
        _next(err);

    }}
export const register
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    const {name, surname, nickName, email, password, age, role} = req.body;

    try {
        let user = await User.findOne({where: {nickName}});
        if (user) {
            return res
                .status(400)
                .json({ message: getLocalizedMessage(req, "userExistsNickname")});
        }

        user = await User.findOne({where: {email}});
        if (user) {
            return res
                .status(400)
                .json({message: getLocalizedMessage(req, "userExistsEmail")});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            surname,
            nickName,
            email,
            password: hashedPassword,
            age,
            role,
        });
        return res.status(201).json({
            data: {
                id: newUser.id,
                name: newUser.name,
                surname: newUser.surname,
                nickName: newUser.nickName,
                email: newUser.email,
                age: newUser.age,
                role: newUser.role,
            },
            message: getLocalizedMessage(req, "userCreated")
        });
    } catch (err) {
        _next(err);
    }
};

export const login
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({where: {email}})
        if (!user) {
            return res.status(401).json({message: getLocalizedMessage(req, "invalidCredentials")})
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(401).json({message: getLocalizedMessage(req, "invalidCredentials")})
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            "secret",
            {expiresIn: '1h'}
        )

        res.json({token})
    } catch (err) {
        _next(err);
    }
};

export const deleteUserByID
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    const id = req.params.id
    try {
        const count = await User.destroy({
            where: {id}
        })

        if (count > 0) {
            return res.json({message: `Deleted user ${id}`})
        } else {
            return res.status(404).json({
                message: getLocalizedMessage(req, "userNotFound"),
            })
        }
    } catch (err) {
        _next(err);
    }
}


