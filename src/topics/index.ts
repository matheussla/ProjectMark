import { Router } from 'express';

import { asyncHandler } from '@shared/middlewares';

import { TopicController } from './controllers/topic.controller';

const topicRouter = Router();
const topicController = new TopicController();

topicRouter.post(
  '/',
  asyncHandler((req, res) => topicController.createTopic(req, res)),
);

topicRouter.get(
  '/',
  asyncHandler((req, res) => topicController.getAllTopics(req, res)),
);

topicRouter.get(
  '/:id',
  asyncHandler((req, res) => topicController.getTopic(req, res)),
);

topicRouter.put(
  '/:id',
  asyncHandler((req, res) => topicController.updateTopic(req, res)),
);

topicRouter.delete(
  '/delete/:id',
  asyncHandler((req, res) => topicController.deleteTopic(req, res)),
);

topicRouter.get(
  '/:id/hierarchy',
  asyncHandler((req, res) => topicController.getTopicHierarchy(req, res)),
);

topicRouter.get(
  '/:id/versions',
  asyncHandler((req, res) => topicController.getTopicVersions(req, res)),
);
topicRouter.get(
  '/:id/version/:version',
  asyncHandler((req, res) => topicController.getTopicVersion(req, res)),
);

export default topicRouter;
