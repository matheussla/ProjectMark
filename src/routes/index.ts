import authRouter from '@auth/routes';
import userRouter from '@users/routes';
import { Router } from 'express';

import topicRouter from '@topics/routes';

const router = Router();

router.use('/topics', topicRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);

export default router;
