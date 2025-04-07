import { User, UserRole } from '@prisma/client';
import { ICreateUserDTO, IUserResponseDTO } from '@users/dtos';

import { prisma } from '@shared/database/prisma';
import { AppError } from '@shared/errors';
import { logger } from '@shared/logger';

export class UserRepository {
  private async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: ICreateUserDTO): Promise<IUserResponseDTO> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role as UserRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    const topic = await this.findById(id);

    if (!topic) {
      logger.warn(`Topic with ID ${id} not found`);
      throw new AppError(404, 'Topic not found');
    }

    await prisma.topic.delete({
      where: { id },
    });
  }
}
