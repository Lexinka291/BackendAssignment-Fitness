import {Router} from 'express'
import {authorizeRoles} from "../middlewares/authRoles";
import {USER_ROLES} from "../utils/enums";
import { jwtAuth } from '../middlewares/jwtAuth';
import * as userController from "../controllers/userController";
import * as exerciseController from "../controllers/exerciseController";
import * as programController from "../controllers/programController";



const router = Router()


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
        '/exercises/add',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        exerciseController.createOrUpdateExercise
    );

    // Update exercise
    router.put(
        '/exercises/:id',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        exerciseController.updateExercise
    );

    // Show exercise
    router.post(
        '/exercises/:id',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        exerciseController.showExercise
    );

    // Delete exercise
    router.post(
        '/exercises/delete/:id',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        exerciseController.deleteExercise
    );

    // -------- PROGRAMS ---------
    // Get all programs
    router.get(
        '/programs',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        programController.getAllPrograms
    );
    // Get program data and exercises
    router.get(
        '/programs/:id',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        programController.getProgramByID
    );
    // Add program
    router.post(
        '/programs/add',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        programController.createProgram
    );
    // Delete program data and its exercises
    router.delete(
        '/programs/delete/:id',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN),
        programController.deleteProgram
    );
    // Add exercise to the program
    router.post(
        "/programs/:id/add",
        programController.addExerciseToProgram
    );
    // Delete exercise from the program
    router.delete(
        "/programs/:programId/delete/:exerciseId",
        programController.deleteExercise
    );
    return router
}