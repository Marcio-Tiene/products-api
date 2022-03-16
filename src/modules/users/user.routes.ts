import express from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from './users.schema';

const registerRouter = express.Router();
const authRouter = express.Router();

const userService = new UserService(UserModel);

const userController = new UserController(userService);

registerRouter.post('/', userController.create);

authRouter.post('/', userController.authenticate);

export { registerRouter, authRouter };
