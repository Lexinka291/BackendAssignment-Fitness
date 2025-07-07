import {Router} from 'express'
import * as userController from "../controllers/userController";
import {jwtAuth} from "../middlewares/jwtAuth";
import {authorizeRoles} from "../middlewares/authRoles";
import {USER_ROLES} from "../utils/enums";

const router = Router()

// Simple USER router
export default () => {
    // _____________ PUBLIC methods _____________
    // Register
    router.post('/register', userController.register);

    // Login
    router.post('/login', userController.login)

    // Get all users
    router.get('/', jwtAuth(),authorizeRoles(USER_ROLES.ADMIN,USER_ROLES.USER), userController.getPublicUsersInfo);

    return router
}