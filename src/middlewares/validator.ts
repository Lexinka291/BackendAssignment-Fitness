import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { body, param, query } from "express-validator";
export enum VALIDATION {
    ID = "ID",
    REGISTER_USER = "REGISTER_USER",
    LOGIN = "LOGIN",
    EXERCISE_QUERY = "EXERCISE_QUERY",
    CREATE_OR_UPDATE_EXERCISE = "CREATE_OR_UPDATE_EXERCISE",
}

export const registerUserValidation = [
    body("name").optional().isString().withMessage("Name must be text."),
    body("surname").optional().isString().withMessage("Surname must be text."),
    body("nickName").optional().isString().withMessage("NickName must be text."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").isLength({ min: 6 }).withMessage("Password too short. At least 6 characters needed."),
    //body("password").isStrongPassword().withMessage("Password not strong enough."),
    body("age").optional().isInt({ min: 3 }).withMessage("Age must be a higher than 3 years."),
    body("age").optional().isInt({ max: 110 }).withMessage("Age must be a lower than 110 years."),
    body("role").optional().isString(),
];
export const idParamValidation = [
    param("id").isInt({min: 0}).withMessage("ID must be an positive integer"),
];

export const loginValidation = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
];
export const createOrUpdateExerciseValidation = [
    body("name").isString().notEmpty().withMessage("Exercise name required"),
    body("description").optional().isString(),
    body("programID").optional().isInt().withMessage("programID must be an integer"),
];

export const exercisesQueryValidation = [
    query("search").optional().isString(),
    query("programID").optional().isInt().withMessage("programID must be an integer"),
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
];
export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            message: "Validation failed",
            errors: errors.array(),
        });
        return;
    }

    next();
};
const validationRulesMap: Record<VALIDATION, any[]> = {
    [VALIDATION.ID]: idParamValidation,
    [VALIDATION.REGISTER_USER]: registerUserValidation,
    [VALIDATION.LOGIN]: loginValidation,
    [VALIDATION.EXERCISE_QUERY]: exercisesQueryValidation,
    [VALIDATION.CREATE_OR_UPDATE_EXERCISE]: createOrUpdateExerciseValidation,
};
export const validateFunc = (type: VALIDATION) => {
    const rules = validationRulesMap[type];
    if (!rules) {
        throw new Error(`Validation type not found for: ${type}`);
    }
    return [...rules, validate];
};