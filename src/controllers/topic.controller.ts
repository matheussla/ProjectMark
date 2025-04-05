import { Request, Response } from 'express';
import { TopicService } from '../services/topic.service';
import { CreateTopicDTO, UpdateTopicDTO } from '../dtos'
import { logger } from '../logger';

export class TopicController {
  private topicService: TopicService;

  constructor() {
    this.topicService = new TopicService();
  }

  async createTopic(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateTopicDTO = req.body;
      const topic = await this.topicService.createTopic(data);
      res.status(201).json(topic);
    } catch (error) {
      logger.error('Error creating topic:', error);
      res.status(500).json({ error: 'Failed to create topic' });
    }
  }

  async getTopic(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const topic = await this.topicService.getTopicById(id);      
      res.json(topic);
    } catch (error) {
      logger.error('Error getting topic:', error);
      res.status(500).json({ error: 'Failed to get topic' });
    }
  }

  async getAllTopics(req: Request, res: Response): Promise<void> {
    try {
      const topics = await this.topicService.getAllTopics();
      res.json(topics);
    } catch (error) {
      logger.error('Error getting all topics:', error);
      res.status(500).json({ error: 'Failed to get topics' });
    }
  }

  async updateTopic(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateTopicDTO = req.body;
      const topic = await this.topicService.updateTopic(id, data);
      res.json(topic);
    } catch (error) {
      logger.error('Error updating topic:', error);
      res.status(500).json({ error: 'Failed to update topic' });
    }
  }

  async deleteTopic(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.topicService.deleteTopic(id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting topic:', error);
      res.status(500).json({ error: 'Failed to delete topic' });
    }
  }

  async getTopicHierarchy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const topic = await this.topicService.getTopicHierarchy(id);
      res.json(topic);
    } catch (error) {
      logger.error('Error getting topic hierarchy:', error);
      res.status(500).json({ error: 'Failed to get topic hierarchy' });
    }
  }
} 