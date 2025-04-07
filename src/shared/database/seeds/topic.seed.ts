import { PrismaClient } from '@prisma/client';

import { logger } from '@shared/logger';

const topics = [
  {
    name: 'Programming Fundamentals',
    content: 'Introduction to programming concepts',
    subtopics: [
      {
        name: 'Data Structures',
        content: 'Basic data structures and algorithms',
        subtopics: [
          {
            name: 'Arrays',
            content: 'Understanding arrays and their operations',
          },
          {
            name: 'Linked Lists',
            content: 'Understanding linked lists and their operations',
          },
        ],
      },
      {
        name: 'Algorithms',
        content: 'Common algorithms and their implementations',
        subtopics: [
          {
            name: 'Sorting',
            content: 'Different sorting algorithms',
          },
          {
            name: 'Searching',
            content: 'Different searching algorithms',
          },
        ],
      },
    ],
  },
  {
    name: 'Web Development',
    content: 'Introduction to web development',
    subtopics: [
      {
        name: 'Frontend',
        content: 'Frontend development technologies',
        subtopics: [
          {
            name: 'React',
            content: 'React framework fundamentals',
          },
          {
            name: 'Vue',
            content: 'Vue framework fundamentals',
          },
        ],
      },
      {
        name: 'Backend',
        content: 'Backend development technologies',
        subtopics: [
          {
            name: 'Node.js',
            content: 'Node.js server-side JavaScript',
          },
          {
            name: 'Express',
            content: 'Express.js web framework',
          },
        ],
      },
    ],
  },
];

export async function seedTopics(prisma: PrismaClient): Promise<void> {
  logger.info('Seeding topics...');

  await prisma.topic.deleteMany();

  const rootTopic = await prisma.topic.create({
    data: {
      name: 'Root',
      content: 'Root of all topics',
      version: 1,
      isLatestVersion: true,
    },
  });

  for (const mainTopic of topics) {
    const mainTopicRecord = await prisma.topic.create({
      data: {
        name: mainTopic.name,
        content: mainTopic.content,
        version: 1,
        isLatestVersion: true,
        parentTopicId: rootTopic.id,
      },
    });

    for (let i = 2; i <= 3; i++) {
      await prisma.topic.create({
        data: {
          name: `${mainTopic.name} v${i}`,
          content: `${mainTopic.content} - Version ${i}`,
          version: i,
          isLatestVersion: i === 3,
          parentTopicId: rootTopic.id,
        },
      });
    }

    for (const subtopic of mainTopic.subtopics ?? []) {
      const subtopicRecord = await prisma.topic.create({
        data: {
          name: subtopic.name,
          content: subtopic.content,
          version: 1,
          isLatestVersion: true,
          parentTopicId: mainTopicRecord.id,
        },
      });

      for (let i = 2; i <= 3; i++) {
        await prisma.topic.create({
          data: {
            name: `${subtopic.name} v${i}`,
            content: `${subtopic.content} - Version ${i}`,
            version: i,
            isLatestVersion: i === 3,
            parentTopicId: mainTopicRecord.id,
          },
        });
      }

      for (const subSubTopic of subtopic.subtopics ?? []) {
        const subSubTopicRecord = await prisma.topic.create({
          data: {
            name: subSubTopic.name,
            content: subSubTopic.content,
            version: 1,
            isLatestVersion: true,
            parentTopicId: subtopicRecord.id,
          },
        });

        for (let i = 2; i <= 3; i++) {
          await prisma.topic.create({
            data: {
              name: `${subSubTopic.name} v${i}`,
              content: `${subSubTopic.content} - Version ${i}`,
              version: i,
              isLatestVersion: i === 3,
              parentTopicId: subtopicRecord.id,
            },
          });
        }
      }
    }
  }

  logger.info('Topics seeded successfully');
}
