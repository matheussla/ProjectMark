import { Request, Response } from 'express';

import { ICreateTopicDTO, IUpdateTopicDTO } from '@topics/dtos';
import { TopicService } from '@topics/services';

export class TopicController {
  private topicService: TopicService;

  constructor() {
    this.topicService = new TopicService();
  }

  async createTopic(req: Request, res: Response): Promise<void> {
    const data: ICreateTopicDTO = req.body;
    const topic = await this.topicService.createTopic(data);
    res.status(201).json(topic);
  }

  async getTopic(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const topic = await this.topicService.getTopicById(id);
    res.status(200).json(topic);
  }

  async getAllTopics(req: Request, res: Response): Promise<void> {
    const topics = await this.topicService.getAllTopics(req.query);
    res.status(200).json(topics);
  }

  async updateTopic(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: IUpdateTopicDTO = req.body;
    const topic = await this.topicService.updateTopic(id, data);
    res.status(200).json(topic);
  }

  async deleteTopic(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.topicService.deleteTopic(id);
    res.status(204).send({ message: 'Topic deleted successfully' });
  }

  async getTopicHierarchy(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const topic = await this.topicService.getTopicHierarchy(id);
    res.status(200).json(topic);
  }

  async getTopicVersion(req: Request, res: Response): Promise<void> {
    const { id, version } = req.params;
    const topic = await this.topicService.getTopicVersion({
      topicId: id,
      version: version ? parseInt(version, 10) : undefined,
    });
    res.status(200).json(topic);
  }

  async getTopicVersions(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const versions = await this.topicService.getTopicVersions(id);
    res.status(200).json(versions);
  }
}
