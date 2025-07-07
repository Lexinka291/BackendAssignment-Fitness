import {Router, Request, Response, NextFunction, raw} from 'express'

import {models} from '../db'
import passport from "passport";

const bcrypt = require("bcrypt");
import {authorizeRoles} from "../middlewares/authRoles";
import {USER_ROLES} from "../utils/enums";
import { jwtAuth } from '../middlewares/jwtAuth';
import * as userController from "../controllers/userController";
import * as exerciseController from "../controllers/exerciseController";
import {deleteExercise} from "../controllers/exerciseController";
import {deleteUserByID, updateUserByID} from "../controllers/userController";


const router = Router()

const {
    User,
    Exercise,
    Program
} = models

export default () => {

    // -------- USERS ---------
    // Get list of all users
    router.get('/users',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        userController.getUsers);

    // Get User by ID
    router.get(
        "/users/:id",
        jwtAuth(),
        authorizeRoles("ADMIN"),
        userController.getUserByID
    );
    router.delete(
        '/delete/:id',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        userController.deleteUserByID
    )

    // Update user by ID
    router.put(
        '/users/:id',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        userController.updateUserByID
    )

    // -------- EXERCISES ---------
    // Create new exercise or if exists - update it
    router.post(
        '/exercise',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        exerciseController.createOrUpdateExercise
    );

    // Update exercise
    router.put(
        '/exercise/:id',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        exerciseController.updateExercise
    );

    // Show exercise
    router.post(
        '/exercise/:id',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        exerciseController.showExercise
    );

    // Delete exercise
    router.post(
        '/exercise/delete/:id',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        exerciseController.deleteExercise
    );

    // -------- PROGRAMS ---------


    return router
}