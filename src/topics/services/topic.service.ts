import { Topic } from '@prisma/client';

import { logger } from '@shared/logger';
import { AppError } from '@shared/middlewares/errorHandler';
import { ICreateTopicDTO, IUpdateTopicDTO, ITopicVersionQuery } from '@topics/dtos';
import { TopicRepository } from '@topics/repositories';

export class TopicService {
  private topicRepository: TopicRepository;

  constructor() {
    this.topicRepository = new TopicRepository();
  }

  async createTopic(data: ICreateTopicDTO): Promise<Topic> {
    return this.topicRepository.create(data);
  }

  async getTopicById(id: string): Promise<Topic | null> {
    const topic = await this.topicRepository.getById(id);

    if (!topic) {
      throw new AppError(404, 'Topic not found');
    }

    return topic;
  }

  async getTopicVersion(query: ITopicVersionQuery): Promise<Topic | null> {
    const topic = await this.topicRepository.getTopicVersion(query);

    if (!topic) {
      throw new AppError(404, 'Topic version not found');
    }

    return topic;
  }

  async getAllTopics(query: { latestVersion?: string }): Promise<Topic[]> {
    const { latestVersion } = query;
    const topics = await this.topicRepository.getAll(latestVersion);

    if (!topics || topics.length === 0) {
      logger.warn('No topics found');
      throw new AppError(404, 'No topics found');
    }

    return topics;
  }

  async getTopicVersions(id: string): Promise<Topic[]> {
    const versions = await this.topicRepository.getTopicVersions(id);

    if (!versions || versions.length === 0) {
      logger.warn(`No versions found for topic with ID ${id}`);
      throw new AppError(404, 'No versions found for this topic');
    }

    return versions;
  }

  async updateTopic(id: string, data: IUpdateTopicDTO): Promise<Topic | null> {
    const topic = await this.topicRepository.createNewVersion(id, data);

    if (!topic) {
      logger.warn(`Not able to create new version for topic with ID ${id}`);
      throw new AppError(404, 'Not able to create new version for this topic');
    }

    return topic;
  }

  async deleteTopic(id: string): Promise<void> {
    return this.topicRepository.delete(id);
  }

  async getTopicHierarchy(id: string): Promise<Topic & { subTopics: Topic[] }> {
    const topic = await this.topicRepository.getTopicHierarchyRecursive(id);

    if (!topic) {
      throw new AppError(404, 'Topic hierarchy not found');
    }

    return topic;
  }
}
