import { Router } from 'express';
import topicRouter from '@topics';

const router = Router();

router.use('/topics', topicRouter);

export default router; 