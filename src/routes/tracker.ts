import {Router} from 'express'
import {authorizeRoles} from "../middlewares/authRoles";
import {USER_ROLES} from "../utils/enums";
import { jwtAuth } from '../middlewares/jwtAuth';
import * as userController from "../controllers/userController";
import * as trackerController from "../controllers/trackerController";
import * as exerciseController from "../controllers/exerciseController";
import * as programController from "../controllers/programController";
import {idParamValidation, validateFunc, VALIDATION} from "../middlewares/validator";

const router = Router();
export default () => {

    // -------- TRACKING ---------
    // Get list of all users
    router.get('/',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN,USER_ROLES.USER),
        trackerController.getTrackedExercises);

    // Get User by ID
    router.post(
        '/add',
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN , USER_ROLES.USER),
        trackerController.addTracking
    );
    router.delete(
        '/delete/:id',
        validateFunc(VALIDATION.ID),
        jwtAuth(),
        authorizeRoles(USER_ROLES.ADMIN , USER_ROLES.USER),
        trackerController.deleteTracking
    )


    return router
}