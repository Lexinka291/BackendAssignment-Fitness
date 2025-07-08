import {Router} from 'express'
import * as userController from "../controllers/userController";
import {jwtAuth} from "../middlewares/jwtAuth";
import {authorizeRoles} from "../middlewares/authRoles";
import {USER_ROLES} from "../utils/enums";
import {loginValidation, registerUserValidation, validate, validateFunc, VALIDATION} from "../middlewares/validator";

const router = Router()

// Simple USER router
export default () => {
    // _____________ PUBLIC methods _____________
    // Register
    router.post('/register', validateFunc(VALIDATION.REGISTER_USER), userController.register);

    // Login
    router.post('/login', validateFunc(VALIDATION.LOGIN), userController.login)

    // Get all users
    router.get('/', jwtAuth(), authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.USER), userController.getPublicUsersInfo);

    // Get profile
    router.get('/profile', jwtAuth(), authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.USER), userController.getProfile);

    return router
}