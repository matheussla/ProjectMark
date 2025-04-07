import { Topic } from '@prisma/client';

import { AppError } from '@shared/errors';
import { logger } from '@shared/logger';
import { ICreateTopicDTO, IUpdateTopicDTO, ITopicVersionQuery } from '@topics/dtos';
import { TopicRepository } from '@topics/repositories';

export class TopicService {
  private topicRepository: TopicRepository;

  constructor() {
    this.topicRepository = new TopicRepository();
  }

  private async twoEndsBFS(startId: string, endId: string): Promise<string[]> {
    if (startId === endId) {
      return [startId];
    }

    const topics = (await this.topicRepository.getAll()) as Topic[];
    if (!topics.length) {
      logger.warn('No topics found');
      throw new AppError(404, 'No topics found');
    }

    const graph: Record<string, string[]> = {};
    for (const topic of topics) {
      graph[topic.id] = [];
    }

    for (const topic of topics) {
      if (topic.parentTopicId) {
        graph[topic.id].push(topic.parentTopicId);
        graph[topic.parentTopicId]?.push(topic.id);
      }
    }

    if (!graph[startId] || !graph[endId]) {
      logger.warn('Invalid startId or endId - not found in topics');
      throw new AppError(404, 'Invalid startId or endId - not found in topics');
    }

    const startQueue: string[] = [startId];
    const endQueue: string[] = [endId];
    const visitedFromStart: Record<string, string | null> = { [startId]: null };
    const visitedFromEnd: Record<string, string | null> = { [endId]: null };
    let intersection: string | null = null;

    while (startQueue.length && endQueue.length) {
      const currentStart = startQueue.shift();
      if (currentStart === undefined) break;
      for (const neighbor of graph[currentStart]) {
        if (!(neighbor in visitedFromStart)) {
          visitedFromStart[neighbor] = currentStart;
          startQueue.push(neighbor);
          if (neighbor in visitedFromEnd) {
            intersection = neighbor;
            break;
          }
        }
      }

      if (intersection) break;
      const currentEnd = endQueue.shift();
      if (currentEnd === undefined) break;

      for (const neighbor of graph[currentEnd]) {
        if (!(neighbor in visitedFromEnd)) {
          visitedFromEnd[neighbor] = currentEnd;
          endQueue.push(neighbor);
          if (neighbor in visitedFromStart) {
            intersection = neighbor;
            break;
          }
        }
      }
      if (intersection) break;
    }

    if (!intersection) {
      logger.warn('No path found between the specified topics');
      throw new AppError(404, 'No path found between the specified topics');
    }

    const path: string[] = [];
    let node = intersection;

    while (node) {
      path.unshift(node);
      node = visitedFromStart[node]!;
    }

    node = visitedFromEnd[intersection]!;
    const forwardPart: string[] = [];
    while (node) {
      forwardPart.push(node);
      node = visitedFromEnd[node]!;
    }

    logger.info('Path found between the specified topics');

    return path.concat(forwardPart);
  }

  async createTopic(data: ICreateTopicDTO): Promise<Topic> {
    try {
      return this.topicRepository.create(data);
    } catch (error) {
      logger.error(`Error creating topic: ${error}`);
      throw new AppError(500, 'Error creating topic');
    }
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
    try {
      const topic = await this.topicRepository.createNewVersion(id, data);

      if (!topic) {
        logger.warn(
          `Not able to create new version for topic with ID ${id}, this topic does not exist or is not latest version`,
        );
        throw new AppError(
          404,
          `Not able to create new version for topic with ID ${id}, this topic does not exist or is not latest version`,
        );
      }

      return topic;
    } catch (error) {
      logger.error(`Error updating topic with ID ${id}: ${error}`);
      throw new AppError(500, 'Error updating topic');
    }
  }

  async deleteTopic(id: string): Promise<void> {
    try {
      await this.topicRepository.delete(id);
    } catch (error) {
      logger.error(`Error deleting topic with ID ${id}: ${error}`);
      throw new AppError(500, 'Error deleting topic');
    }
  }

  async getTopicHierarchy(id: string): Promise<Topic & { subTopics: Topic[] }> {
    try {
      const topic = await this.topicRepository.getTopicHierarchyRecursive(id);

      if (!topic) {
        throw new AppError(404, 'Topic hierarchy not found');
      }

      return topic;
    } catch (error) {
      logger.error(`Error getting topic hierarchy for ID ${id}: ${error}`);
      throw new AppError(500, 'Error getting topic hierarchy');
    }
  }

  async findShortestPath(startId: string, endId: string): Promise<string[]> {
    try {
      const startTopic = await this.topicRepository.getById(startId);
      const endTopic = await this.topicRepository.getById(endId);

      if (!startTopic || !endTopic) {
        logger.warn('One or both topics not found');
        throw new AppError(404, 'One or both topics not found');
      }

      return this.twoEndsBFS(startId, endId);
    } catch (error) {
      logger.error(`Error finding shortest path between topics ${startId} and ${endId}: ${error}`);
      throw new AppError(500, 'Error finding shortest path');
    }
  }
}
