import { Router } from 'express';

import { asyncHandler } from '@shared/middlewares';

import { AuthController } from './controllers/auth.controller';

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  '/login',
  asyncHandler((req, res) => authController.login(req, res)),
);

export default authRouter;
