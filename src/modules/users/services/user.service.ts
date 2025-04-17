import { ICreateUserDTO, IUserResponseDTO } from '@users/dtos';
import { UserRepository } from '@users/repositories';
import { hash } from 'bcryptjs';

import { AppError } from '@shared/errors';
import { logger } from '@shared/logger';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(data: ICreateUserDTO): Promise<IUserResponseDTO> {
    try {
      const userExists = await this.userRepository.findUserByEmail(data.email);

      if (userExists) {
        throw new AppError(400, 'User already exists');
      }

      const hashedPassword = await hash(data.password, 10);

      return this.userRepository.create({
        ...data,
        password: hashedPassword,
      });
    } catch (error) {
      logger.error(`Error creating user: ${error}`);
      throw new AppError(500, 'Error creating user');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      logger.error(`Error deleting user with ID ${id}: ${error}`);
      throw new AppError(500, 'Error deleting user');
    }
  }
}
