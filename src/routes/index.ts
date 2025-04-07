import authRouter from '@auth';
import { Router } from 'express';

import topicRouter from '@topics';

const router = Router();

router.use('/topics', topicRouter);
router.use('/auth', authRouter);

export default router;
