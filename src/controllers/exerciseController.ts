import {Request, Response, NextFunction} from 'express'

import {models} from '../db'
import {getLocalizedMessage} from "../utils/localize";

const {
    Program,
    Exercise
} = models

// Create or update exercise
export const createOrUpdateExercise =
    async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
        try {
            const {name, difficulty, programID} = req.body;

            const program = await Program.findByPk(programID);
            if (!program) {
                return res.status(400).json({
                    message: getLocalizedMessage(req, "programNotFound"),
                });
            }

            // Check if there is exercise with the same name within the same program
            const existingExercise = await Exercise.findOne({
                where: {
                    name,
                    programID: programID,
                },
            });

            if (existingExercise) {
                // Update existing
                await existingExercise.update({
                    name,
                    difficulty,
                    programID: programID
                });

                return res.json({
                    message: getLocalizedMessage(req, "exerciseDifficultyUpdated"),
                    existingExercise,
                });
            }

            const exercise = await Exercise.create({
                name,
                difficulty,
                programID: programID,
            });

            res.status(201).json({
                data: exercise,
                message: getLocalizedMessage(req, "exerciseCreated"),
            });
        } catch (err) {
            _next(err)
        }
    }

export const updateExercise =
    async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
        const { id } = req.params;
        const { name, difficulty ,programID  } = req.body;

        try {
            const exercise = await Exercise.findByPk(id);
            if (!exercise) {
                return res.status(404).json({ message: getLocalizedMessage(req, "exerciseNotFound") });
            }

            await exercise.update({ name ,difficulty, programID});
            res.json(exercise);
        } catch (err) {
            _next(err)
        }
    };

export const deleteExercise
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {

    const {id} = req.params;
    try {
        const count = await Exercise.destroy({where: {id}});
        if (count === 0) {
            return res.status(404).json({ message: getLocalizedMessage(req, "exerciseNotFound") });
        }
        res.json({message: `Exercise ${id} deleted`});
    } catch (err) {
        _next(err)

    }
};
export const showExercise
= async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    const { id } = req.params;
    try {
        const exercise = await Exercise.findByPk(id);
        if (!exercise) {
            return res.status(404).json({ message: getLocalizedMessage(req, "exerciseNotFound") });
        }
        res.json(exercise);
    } catch (err) {
        _next(err)
    }
};