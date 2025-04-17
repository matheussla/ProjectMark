export interface ICreateTopicDTO {
  name: string;
  content: string;
  parentTopicId?: string;
}

export interface IUpdateTopicDTO {
  name?: string;
  content?: string;
  parentTopicId?: string;
}

export interface ITopicVersionQuery {
  topicId: string;
  version?: number;
}
