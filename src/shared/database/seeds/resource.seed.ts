import { PrismaClient, ResourceType, Topic } from '@prisma/client';

import { logger } from '@logger';

const resourcesData = [
  {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    description: 'MDN JavaScript Documentation',
    type: ResourceType.ARTICLE,
  },
  {
    url: 'https://www.youtube.com/watch?v=javascript-basics',
    description: 'JavaScript Basics Tutorial',
    type: ResourceType.VIDEO,
  },
  {
    url: 'https://reactjs.org/docs/getting-started.html',
    description: 'React Official Documentation',
    type: ResourceType.ARTICLE,
  },
  {
    url: 'https://nodejs.org/en/docs/',
    description: 'Node.js Documentation',
    type: ResourceType.ARTICLE,
  },
  {
    url: 'https://example.com/react-patterns.pdf',
    description: 'React Design Patterns Guide',
    type: ResourceType.PDF,
  },
];

export async function seedResources(prisma: PrismaClient): Promise<void> {
  logger.info('Seeding resources...');

  const topics = await prisma.topic.findMany();

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    const resources = resourcesData.slice(i, i + 2);

    for (const resource of resources) {
      await prisma.resource.create({
        data: {
          topicId: topic.id,
          ...resource,
        },
      });
    }
  }

  logger.info('Resources seeded successfully');
}
