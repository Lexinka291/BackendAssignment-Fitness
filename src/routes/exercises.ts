import { Router, Request, Response, NextFunction } from 'express'
import { Op } from "sequelize";

import { models } from '../db'
import {validateFunc, VALIDATION} from "../middlewares/validator";

const router = Router()

const {
    Exercise,
    Program
} = models

export default () => {
    router.get('/', validateFunc(VALIDATION.EXERCISE_QUERY),async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            // Extract query params
            // Pagination: /exercises?page=1&limit=10
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            //Filter: /exercises?programID=1
            const programID  = req.params.programID;
            //Search: /exercises?search=cis
            const searchValue = req.query.search as string;

            // Getting correct starting point for pagination
            const nextPageOffset = (page - 1) * limit;

            // Setting where with filter and search conditions
            const condition: any = {};
            if (programID) {
                condition.programID = programID;
            }
            if (searchValue) {
                condition.name = {
                    [Op.iLike]: `%${searchValue}%`
                };
            }


            const { count, rows } = await Exercise.findAndCountAll({
                where: condition,
                offset: nextPageOffset,
                limit,
                include: [{
                    model: Program,
                    as: 'program',
                }]
            });

            return res.json({
                data: {
                    total: count,
                    page,
                    pageSize: limit,
                    exercises: rows,
                },
                message: 'List of exercises'
            });
        } catch (error) {
            next(error);
        }
    });

    return router;
}