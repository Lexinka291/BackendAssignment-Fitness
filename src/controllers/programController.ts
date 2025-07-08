import {Request, Response, NextFunction} from 'express'

import {models} from '../db'
import {getLocalizedMessage} from "../utils/localize";



const {
    Program,
    Exercise
} = models


// Create or update program
export const createProgram =
    async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
        try {
            const {name} = req.body;

            const program = await Program.create({name});

            res.status(201).json({
                data: program,
                message: getLocalizedMessage(req, "programCreated"),
            });
        } catch (err) {
            _next(err)
        }
    }
export const deleteProgram
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {

    const {id} = req.params;
    try {
        // Check if program exists
        const program = await Program.findByPk(id);
        if (!program) {
            return res.status(404).json({
                message: getLocalizedMessage(req, "programNotFound"),
            });
        }
        // Delete all exercises
        await Exercise.destroy({
            where: { programID: id }
        });
        // Delete the program
        await Program.destroy({
            where: { id }
        });

        res.json({
            message: getLocalizedMessage(req, "programDeleted"),
        });
    } catch (err) {
        _next(err)
    }
};
export const getAllPrograms
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    try {
        const program = await Program.findAll()

        res.status(201).json({
            data: program,
            message: getLocalizedMessage(req, "programsList"),
        });
    } catch (err) {
        _next(err)

    }
};
export const getProgramByID
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    const { id } = req.params;
    try {
        const program = await Program.findByPk(id);
        if (!program) {
            return res.status(404).json({
                message: getLocalizedMessage(req, "programNotFound"),
            });
        }
        const listOfExercises = await Exercise.findAll(
            {
                attributes: ["id", "name"],
                where: {
                    programID: id
                }})
        const data = {ProgramData: program, ExerciseData: listOfExercises}
        res.status(201).json({
            data: data,
            message: getLocalizedMessage(req, "programCreated"),
        });
    } catch (err) {
        _next(err)

    }
};

export const addExerciseToProgram
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, difficulty } = req.body;

        const newExercise = await Exercise.create({
            name,
            difficulty,
            programID: id
        });

        res.status(201).json({
            data: newExercise,
            message: getLocalizedMessage(req, "exerciseCreated"),
        });
    } catch (err) {
        _next(err)
    }
};
export const deleteExercise
    = async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
    try {
        const { programId, exerciseId } = req.params;
        const exercise = await Exercise.findOne({
            where: {
                id: exerciseId,
                programID: programId
            }
        });

        if (!exercise) {
            return res.status(404).json({
                message: getLocalizedMessage(req, "exerciseNotFound"),
            });
        }

        await exercise.destroy();
        res.json({
            message: getLocalizedMessage(req, "exerciseDeleted"),
        });
    } catch (err) {
        _next(err)
    }
};