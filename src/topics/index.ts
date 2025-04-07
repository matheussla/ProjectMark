import { Router } from 'express';

import { asyncHandler, authMiddleware } from '@shared/middlewares';

import { TopicController } from './controllers/topic.controller';

const topicRouter = Router();
const topicController = new TopicController();

topicRouter.get(
  '/',
  asyncHandler((req, res) => topicController.getAllTopics(req, res)),
);
topicRouter.get(
  '/:id',
  asyncHandler((req, res) => topicController.getTopic(req, res)),
);

topicRouter.post(
  '/',
  authMiddleware,
  asyncHandler((req, res) => topicController.createTopic(req, res)),
);
topicRouter.put(
  '/:id',
  authMiddleware,
  asyncHandler((req, res) => topicController.updateTopic(req, res)),
);
topicRouter.delete(
  '/:id',
  authMiddleware,
  asyncHandler((req, res) => topicController.deleteTopic(req, res)),
);
topicRouter.get(
  '/:id/hierarchy',
  authMiddleware,
  asyncHandler((req, res) => topicController.getTopicHierarchy(req, res)),
);
topicRouter.get(
  '/:id/version/:version',
  authMiddleware,
  asyncHandler((req, res) => topicController.getTopicVersion(req, res)),
);
topicRouter.get(
  '/:id/versions',
  authMiddleware,
  asyncHandler((req, res) => topicController.getTopicVersions(req, res)),
);

export default topicRouter;
