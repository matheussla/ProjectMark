import { Router } from 'express';
import { TopicController } from '../controllers/topic.controller';

const router = Router();
const topicController = new TopicController();

router.post('/', (req, res) => topicController.createTopic(req, res));

router.get('/', (req, res) => topicController.getAllTopics(req, res));

router.get('/:id', (req, res) => topicController.getTopic(req, res));

router.put('/:id', (req, res) => topicController.updateTopic(req, res));

router.delete('/:id', (req, res) => topicController.deleteTopic(req, res));

router.get('/:id/hierarchy', (req, res) => topicController.getTopicHierarchy(req, res));

export default router; 