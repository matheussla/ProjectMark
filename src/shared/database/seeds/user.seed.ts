import { PrismaClient, UserRole } from '@prisma/client';

import { logger } from '@logger';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
  },
  {
    name: 'Editor User',
    email: 'editor@example.com',
    role: UserRole.EDITOR,
  },
  {
    name: 'John Viewer',
    email: 'john@example.com',
    role: UserRole.VIEWER,
  },
  {
    name: 'Jane Viewer',
    email: 'jane@example.com',
    role: UserRole.VIEWER,
  },
];

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  logger.info('Seeding users...');

  for (const userData of users) {
    await prisma.user.create({
      data: userData,
    });
  }

  logger.info(`Created ${users.length} users`);
}
