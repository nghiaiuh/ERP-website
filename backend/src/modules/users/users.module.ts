import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUserUseCase } from './application/create-user.use-case';
import { ListUsersUseCase } from './application/list-users.use-case';
import { USER_REPOSITORY } from './domain/user.repository';
import { MongooseUserRepository } from './infrastructure/mongoose-user.repository';
import { UserMongo, UserSchema } from './infrastructure/user.schema';
import { UsersController } from './presentation/users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserMongo.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    ListUsersUseCase,
    { provide: USER_REPOSITORY, useClass: MongooseUserRepository },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
