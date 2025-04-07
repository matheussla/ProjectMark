import { Router } from 'express';
import { TopicController } from './controllers/topic.controller';

const topicRouter = Router();
const topicController = new TopicController();

topicRouter.post('/', (req, res) => topicController.createTopic(req, res));

topicRouter.get('/', (req, res) => topicController.getAllTopics(req, res));

topicRouter.get('/:id', (req, res) => topicController.getTopic(req, res));

topicRouter.put('/:id', (req, res) => topicController.updateTopic(req, res));

topicRouter.delete('/:id', (req, res) => topicController.deleteTopic(req, res));

topicRouter.get('/:id/hierarchy', (req, res) => topicController.getTopicHierarchy(req, res));

export default topicRouter; 