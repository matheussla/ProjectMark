import { Router } from 'express';
import topicRouter from './topic.router';

const router = Router();

router.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/topics', topicRouter);

export default router; 