export interface CreateTopicDTO {
  name: string;
  content: string;
  parentTopicId?: string;
}

export interface UpdateTopicDTO {
  name?: string;
  content?: string;
  parentTopicId?: string;
}