import { PrismaClient } from '@prisma/client';

import { logger } from '@logger';

import { seedResources } from './resource.seed';
import { seedTopics } from './topic.seed';
import { seedUsers } from './user.seed';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  try {
    logger.info('Starting database seeding...');

    await prisma.resource.deleteMany();
    await prisma.topic.deleteMany();
    await prisma.user.deleteMany();

    await seedUsers(prisma);
    const topics = await seedTopics(prisma);
    await seedResources(prisma, topics);

    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  logger.error('Fatal error during seeding:', error);
  process.exit(1);
});
