import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { User } from '../domain/user.entity';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../domain/user.repository';

export interface CreateUserCommand {
  email: string;
  displayName: string;
  tenantId: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const existingUser = await this.users.findByEmail(command.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    return this.users.save(
      User.create({ id: randomUUID(), ...command }),
    );
  }
}
