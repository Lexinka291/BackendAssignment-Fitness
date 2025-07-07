import {Router} from 'express'
import * as userController from "../controllers/userController";
import {jwtAuth} from "../middlewares/jwtAuth";

const router = Router()

// Simple USER router
export default () => {
    // _____________ PUBLIC methods _____________
    // Register
    router.post('/register', userController.register);

    // Login
    router.post('/login', userController.login)

    // Get all users
    router.get('/', jwtAuth(), userController.getUsers);

    return router
}