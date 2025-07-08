import {Request, Response, NextFunction} from 'express'

import {models} from '../db'

const {
    User,
    ExerciseTracker,
    Program,
    Exercise
} = models

export const getTrackedExercises
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    try {
        const userID = (req.user as any).id;
        console.log(userID);
        const user = await User.findByPk(userID);
        if (!user) {
            return res.status(404).json({message: `User Not Found`});
        }
        console.log(user);

        // Get users trackings
        const listOfTrackings = await ExerciseTracker.findAll(
            {
                where: {
                    userID: userID
                }
            })
        if (!listOfTrackings) {
            return res.status(404).json({message: `Exercise Trackings Not Found`});
        }
        res.json({
            data: listOfTrackings,
            message: "List of public user info",
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: err.message});
    }

}
export const addTracking
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    try {
        const userID = (req.user as any).id;
        console.log(userID);
        const {exerciseID, durationSeconds} = req.body;

        const user = await User.findByPk(userID);
        if (!user) {
            return res.status(404).json({message: `User Not Found`});
        }

        let completedAt = new Date()
        const program = await ExerciseTracker.create({
            userID: userID,
            exerciseID: exerciseID,
            completedAt: completedAt,
            durationSeconds: durationSeconds
        });

        res.status(201).json({
            data: program,
            message: 'Tracking created successfully',
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: err.message});
    }
}
    export const deleteTracking
        = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
        try {
            const userID = (req.user as any).id;
            const {id} = req.params;
            console.log(userID);
            const user = await User.findByPk(userID);
            if (!user) {
                return res.status(404).json({message: `User Not Found`});
            }
            const track = await  ExerciseTracker.findOne({where: {id:id}});
            if (!track) {
                return res.status(404).json({message: `Track Not Found`});
            }
            await track.destroy();
            res.json({
                message: `Track ${id} deleted from user ${userID}`
            });

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: err.message});
        }

    }