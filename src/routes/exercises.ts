import { Router, Request, Response, NextFunction } from 'express'
import { Op } from "sequelize";

import { models } from '../db'

const router = Router()

const {
    Exercise,
    Program
} = models

export default () => {
    router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            // Extract query params
            // Pagination: /exercises?page=1&limit=10
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;


            // Getting correct starting point
            const nextPageOffset = (page - 1) * limit;

            const { count, rows } = await Exercise.findAndCountAll({
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