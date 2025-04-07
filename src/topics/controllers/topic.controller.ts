import { Request, Response } from 'express';
import { TopicService } from '@topics/services';
import { ICreateTopicDTO, IUpdateTopicDTO } from '@topics/dtos'
import { logger } from '@logger';

export class TopicController {
  private topicService: TopicService;

  constructor() {
    this.topicService = new TopicService(); 
  }

  async createTopic(req: Request, res: Response): Promise<void> {
    try {
      const data: ICreateTopicDTO = req.body;
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
      res.status(200).json(topic);
    } catch (error) {
      logger.error('Error getting topic:', error);
      res.status(500).json({ error: 'Failed to get topic' });
    }
  }

  async getAllTopics(req: Request, res: Response): Promise<void> {
    try {
      const topics = await this.topicService.getAllTopics();
      res.status(200).json(topics);
    } catch (error) {
      logger.error('Error getting all topics:', error);
      res.status(500).json({ error: 'Failed to get topics' });
    }
  }

  async updateTopic(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: IUpdateTopicDTO = req.body;
      const topic = await this.topicService.updateTopic(id, data);
      res.status(200).json(topic);
    } catch (error) {
      logger.error('Error updating topic:', error);
      res.status(500).json({ error: 'Failed to update topic' });
    }
  }

  async deleteTopic(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.topicService.deleteTopic(id);
      res.status(204).json({ message: 'Topic deleted successfully' });
    } catch (error) {
      logger.error('Error deleting topic:', error);
      res.status(500).json({ error: 'Failed to delete topic' });
    }
  }

  async getTopicHierarchy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const topic = await this.topicService.getTopicHierarchy(id);
      res.status(200).json(topic);
    } catch (error) {
      logger.error('Error getting topic hierarchy:', error);
      res.status(500).json({ error: 'Failed to get topic hierarchy' });
    }
  }
} 