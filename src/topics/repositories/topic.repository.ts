import { prisma } from '@shared/database/prisma';
import { Topic } from '@prisma/client';
import { ICreateTopicDTO, IUpdateTopicDTO } from '@topics/dtos'

export class TopicRepository {
  private async findById(id: string): Promise<Topic | null> {
    return prisma.topic.findUnique({
      where: { id },
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
      },
      include: {
        parentTopic: true,
        subTopics: true,
        resources: true,
      },
    });
  }

  async getById(id: string): Promise<Topic | null> {
    return this.findById(id)
  }

  async getAll(): Promise<Topic[]> {
    return prisma.topic.findMany({
      include: {
        parentTopic: true,
        subTopics: true,
        resources: true,
      },
    });
  }

  async update(id: string, data: IUpdateTopicDTO): Promise<Topic> {
    const currentTopic = await this.findById(id)

    if (!currentTopic) {
      throw new Error('Topic not found');
    }

    return prisma.topic.update({
      where: { id },
      data: {
        name: data.name ?? currentTopic.name,
        content: data.content ?? currentTopic.content,
        parentTopicId: data.parentTopicId,
        version: currentTopic.version + 1,
      },
      include: {
        parentTopic: true,
        subTopics: true,
        resources: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    const topic = await this.findById(id)

    if (!topic) {
      throw new Error('Topic not found');
    }

    await prisma.topic.delete({
      where: { id },
    }); 
  }

  async getTopicHierarchy(id: string): Promise<Topic & { subTopics: Topic[] }> {
    return prisma.topic.findUniqueOrThrow({
      where: { id },
      include: {
        subTopics: {
          include: {
            subTopics: true,
          },
        },
      },
    });
  }
} 