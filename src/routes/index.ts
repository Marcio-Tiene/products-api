import express from 'express';
import { authRouter, registerRouter } from '../modules/users/user.routes';

const router = express.Router();

router.use('/register', registerRouter);
router.use('/auth', authRouter);

export { router };
