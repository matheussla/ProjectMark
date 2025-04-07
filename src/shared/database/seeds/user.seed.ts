import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

import { logger } from '@logger';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    password: 'admin123',
  },
  {
    name: 'Editor User',
    email: 'editor@example.com',
    role: UserRole.EDITOR,
    password: 'editor123',
  },
  {
    name: 'John Viewer',
    email: 'john@example.com',
    role: UserRole.VIEWER,
    password: 'viewer123',
  },
  {
    name: 'Jane Viewer',
    email: 'jane@example.com',
    role: UserRole.VIEWER,
    password: 'viewer123',
  },
];

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  logger.info('Seeding users...');

  for (const userData of users) {
    const hashedPassword = await hash(userData.password, 10);
    await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  logger.info(`Created ${users.length} users`);
}
