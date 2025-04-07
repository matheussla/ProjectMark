import { Topic } from '@prisma/client';
import { TopicRepository } from '@topics/repositories'
import { ICreateTopicDTO, IUpdateTopicDTO } from '@topics/dtos'

export class TopicService {
  private topicRepository: TopicRepository;

  constructor() {
    this.topicRepository = new TopicRepository();
  }

  async createTopic(data: ICreateTopicDTO): Promise<Topic> {
    return this.topicRepository.create(data)
  }

  async getTopicById(id: string): Promise<Topic | null> {
    return this.topicRepository.getById(id)
  }

  async getAllTopics(): Promise<Topic[]> {
    return this.topicRepository.getAll()
  }

  async updateTopic(id: string, data: IUpdateTopicDTO): Promise<Topic> {
    return this.topicRepository.update(id, data)
  }

  async deleteTopic(id: string): Promise<void> {
   return this.topicRepository.delete(id)
  }

  async getTopicHierarchy(id: string): Promise<Topic & { subTopics: Topic[] }> {
    return this.getTopicHierarchy(id)
  }
} 