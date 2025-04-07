import { PrismaClient, Topic } from '@prisma/client';

import { logger } from '@logger';

const topics = [
  {
    name: 'JavaScript Fundamentals',
    content: 'Core concepts of JavaScript programming language',
    subtopics: [
      {
        name: 'Variables and Data Types',
        content: 'Understanding variables, let, const, and JavaScript data types',
      },
      {
        name: 'Functions',
        content: 'Function declarations, expressions, and arrow functions',
      },
    ],
  },
  {
    name: 'React Basics',
    content: 'Introduction to React development',
    subtopics: [
      {
        name: 'Components',
        content: 'Understanding React components and their lifecycle',
      },
      {
        name: 'State Management',
        content: 'Managing state in React applications',
      },
    ],
  },
  {
    name: 'Node.js',
    content: 'Server-side JavaScript with Node.js',
    subtopics: [
      {
        name: 'Express.js',
        content: 'Web application framework for Node.js',
      },
      {
        name: 'APIs',
        content: 'Building RESTful APIs with Node.js',
      },
    ],
  },
];

export async function seedTopics(prisma: PrismaClient): Promise<Topic[]> {
  logger.info('Seeding topics...');

  const createdTopics: Topic[] = [];

  for (const topicData of topics) {
    const topicV1 = await prisma.topic.create({
      data: {
        name: topicData.name,
        content: topicData.content,
        version: 1,
        isLatestVersion: false,
      },
    });

    createdTopics.push(topicV1);

    const topicV2 = await prisma.topic.create({
      data: {
        name: topicData.name,
        content: `${topicData.content} - Version 2`,
        version: 2,
        isLatestVersion: true,
      },
    });

    createdTopics.push(topicV2);

    for (const subtopic of topicData.subtopics) {
      await prisma.topic.create({
        data: {
          name: subtopic.name,
          content: subtopic.content,
          version: 1,
          isLatestVersion: true,
          parentTopicId: topicV2.id,
        },
      });
    }
  }

  logger.info(`Created ${createdTopics.length} main topics with their subtopics`);
  return createdTopics;
}
