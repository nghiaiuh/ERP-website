import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AbacGuard } from '../../../core/authorization/abac.guard';
import { RequirePermission } from '../../../core/authorization/require-permission.decorator';
import { CreateUserUseCase } from '../application/create-user.use-case';
import { ListUsersUseCase } from '../application/list-users.use-case';
import type { User } from '../domain/user.entity';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
@UseGuards(AbacGuard)
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly listUsers: ListUsersUseCase,
  ) {}

  @Post()
  @RequirePermission({ resource: 'user', action: 'create' })
  create(@Body() body: CreateUserDto): Promise<User> {
    return this.createUser.execute(body);
  }

  @Get()
  @RequirePermission({ resource: 'user', action: 'read' })
  list(): Promise<User[]> {
    return this.listUsers.execute();
  }
}
