import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../../middlewares/auth';

import { UserRepository } from '../dataAccess/userRepository';
import { UserService } from '../services/userService';
import { UserController } from '../controllers/userController';
import { LoginService } from '../services/authService';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const loginService = new LoginService(userRepository);
const authController = new AuthController(loginService);

const user = Router();

user.post('/login', authController.login);
user.post('/register', userController.register);

user.use(authenticate);
user.get('/session',(req, res) => {
    return res.status(200).send();
})

user.get('/info', userController.userInfo);

export default user;