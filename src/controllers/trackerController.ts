import {Request, Response, NextFunction} from 'express'

import {models} from '../db'
import {getLocalizedMessage} from "../utils/localize";

const {
    User,
    ExerciseTracker,
} = models

export const getTrackedExercises
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    try {
        const userID = (req.user as any).id;
        const user = await User.findByPk(userID);
        if (!user) {
            return res.status(404).json({
                message: getLocalizedMessage(req, "userNotFound")
            });
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
            return res.status(404).json({
                message: getLocalizedMessage(req, "exerciseTrackingsNotFound")
            });
        }
        res.json({
            data: listOfTrackings,
            message: getLocalizedMessage(req, "listOfUserTrackings"),
        })
    } catch (err) {
        _next(err)

    }

}
export const addTracking
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    try {
        const userID = (req.user as any).id;
        const {exerciseID, durationSeconds} = req.body;

        const user = await User.findByPk(userID);
        if (!user) {
            return res.status(404).json({
                message: getLocalizedMessage(req, "userNotFound"),
            });
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
            message: getLocalizedMessage(req, "trackingCreatedSuccessfully"),        });
    } catch (err) {
        _next(err)
    }
}
    export const deleteTracking
        = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
        try {
            const userID = (req.user as any).id;
            const {id} = req.params;
            const user = await User.findByPk(userID);
            if (!user) {
                return res.status(404).json({
                        message: getLocalizedMessage(req, "trackNotFound"),
                });
            }
            const track = await  ExerciseTracker.findOne({where: {id:id}});
            if (!track) {
                return res.status(404).json({message: `Track Not Found`});
            }
            await track.destroy();
            res.json({
                message: getLocalizedMessage(req, "trackDeleted")
            });

        } catch (err) {
            _next(err)

        }

    }