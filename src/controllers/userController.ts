import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

import {models} from '../db'
import bcrypt from "bcrypt";
import {UserModel} from "../db/user";


const {
    User,
    ExerciseTracker,
    Exercise,
    Program
} = models

export const getPublicUsersInfo
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    console.log("Route handler running...");
    // Get id and nickname
    const users = await User.findAll({
        attributes: ["id", "nickName"],
    });
    res.json({
        data: users,
        message: "List of public user info",
    })
}

export const getUsers
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    console.log("Route handler running...");
    const users = await User.findAll();
    res.json({
        data: users,
        message: "List of users",
    });
}
export const getUserByID =
    async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
        const {id} = req.params;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }
            const profileData = GetUserDetails(user)
            res.json({
                data: profileData,
                message: `Getting user ${user.id}`,
            });        } catch (err: any) {
            console.error(err);
            res.status(500).json({message: "Error fetching user", error: err.message});
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
            return res.status(404).json({ message: "User not found" });
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
            message: "Profile data of logged user"
        });
    } catch (err: any) {
        console.error(err);
        return res
            .json({message: "Error getting user profile", error: err.message});
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
            return res.status(404).json({message: "User not found'})"})
        }
        // Check the parameters to updates send by user
        const updates = await GetReqBodyUpdates()
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No fields provided to update"
            });
        }
        // Perform the update
        await user.update(updates);

        res.json({
            data: user,
            message: `Updated user ${id} data`,
        });
    } catch (err: any) {
        console.error(err);
        return res
            .json({message: "Error updating user", error: err.message});
    }}
export const register
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    const {name, surname, nickName, email, password, age, role} = req.body;

    try {
        let user = await User.findOne({where: {nickName}});
        if (user) {
            return res
                .status(400)
                .json({message: `User with the same nickname already exists`});
        }

        user = await User.findOne({where: {email}});
        if (user) {
            return res
                .status(400)
                .json({message: `User with the same email already exists`});
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
            id: newUser.id,
            name: newUser.name,
            surname: newUser.surname,
            nickName: newUser.nickName,
            email: newUser.email,
            age: newUser.age,
            role: newUser.role,
        });
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .json({message: "Error creating user", error: err.message});
    }
};

export const login
    = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({where: {email}})
        if (!user) {
            res.status(401).json({message: 'Invalid credentials'})
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            res.status(401).json({message: 'Invalid credentials'})
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
        console.error(err)
        next(err)
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
            return res.status(404).json({message: 'User not found'})
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: 'Error deleting user'})
    }
}


