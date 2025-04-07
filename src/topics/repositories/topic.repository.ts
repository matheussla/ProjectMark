import { Topic } from '@prisma/client';

import { prisma } from '@shared/database/prisma';
import { logger } from '@shared/logger';
import { AppError } from '@shared/middlewares/errorHandler';
import { ICreateTopicDTO, IUpdateTopicDTO, ITopicVersionQuery } from '@topics/dtos';

export class TopicRepository {
  private async findById(id: string, currentVersion?: true): Promise<Topic | null> {
    const where: { id: string; isLatestVersion?: boolean } = {
      id,
    };

    if (currentVersion) {
      where.isLatestVersion = true;
    }

    return prisma.topic.findFirst({
      where,
      include: {
        parentTopic: true,
        subTopics: true,
        resources: true,
      },
    });
  }

  async create(data: ICreateTopicDTO): Promise<Topic> {
    return prisma.topic.create({
      data: {
        name: data.name,
        content: data.content,
        parentTopicId: data.parentTopicId,
        version: 1,
        isLatestVersion: true,
      },
      include: {
        parentTopic: true,
        subTopics: true,
        resources: true,
      },
    });
  }

  async getById(id: string): Promise<Topic | null> {
    return this.findById(id);
  }

  async getTopicVersion(query: ITopicVersionQuery): Promise<Topic | null> {
    const where: { id: string; version?: number } = {
      id: query.topicId,
    };

    if (query.version) {
      where.version = query.version;
    }

    return prisma.topic.findFirst({
      where,
      include: {
        parentTopic: true,
        subTopics: true,
        resources: true,
      },
    });
  }

  async getTopicVersions(id: string): Promise<Topic[]> {
    return prisma.topic.findMany({
      where: { id },
      orderBy: { version: 'desc' },
      include: {
        parentTopic: true,
        subTopics: true,
        resources: true,
      },
    });
  }

  async createNewVersion(id: string, data: IUpdateTopicDTO): Promise<Topic | null> {
    const currentTopic = await this.findById(id, true);

    if (!currentTopic) {
      return null;
    }

    return prisma.$transaction(async (tx) => {
      await tx.topic.update({
        where: { id },
        data: { isLatestVersion: false },
      });

      return tx.topic.create({
        data: {
          id,
          name: data.name ?? currentTopic.name,
          content: data.content ?? currentTopic.content,
          parentTopicId: data.parentTopicId ?? currentTopic.parentTopicId,
          version: currentTopic.version + 1,
          isLatestVersion: true,
        },
        include: {
          parentTopic: true,
          subTopics: true,
          resources: true,
        },
      });
    });
  }

  async getAll(latestVersion?: string): Promise<Topic[] | []> {
    const where: { isLatestVersion?: boolean } = {};

    if (latestVersion) {
      where.isLatestVersion = true;
    }

    return prisma.topic.findMany({
      where,
      include: {
        parentTopic: true,
        subTopics: true,
        resources: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    const topic = await this.findById(id);

    if (!topic) {
      logger.warn(`Topic with ID ${id} not found`);
      throw new AppError(404, 'Topic not found');
    }

    await prisma.topic.delete({
      where: { id },
    });
  }

  async getTopicHierarchyRecursive(id: string): Promise<Topic & { subTopics: Topic[] }> {
    const topic = await prisma.topic.findFirst({
      where: {
        id,
        isLatestVersion: true,
      },
      include: {
        subTopics: {
          where: {
            isLatestVersion: true,
          },
          include: {
            subTopics: {
              where: {
                isLatestVersion: true,
              },
            },
          },
        },
      },
    });

    if (!topic) {
      logger.warn(`Topic with ID ${id} not found`);
      throw new AppError(404, `Topic with ID ${id} not found`);
    }

    const subTopicsWithHierarchy = await Promise.all(
      topic.subTopics.map(async (subTopic) => {
        try {
          return this.getTopicHierarchyRecursive(subTopic.id);
        } catch (error) {
          if (error instanceof AppError && error.statusCode === 404) {
            return subTopic;
          }
          throw error;
        }
      }),
    );

    return {
      ...topic,
      subTopics: subTopicsWithHierarchy,
    };
  }
}
