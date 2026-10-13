import type { Repository } from '../../../core/domain/repository';
import type { User } from './user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository extends Repository<User, string> {
  findByEmail(email: string): Promise<User | null>;
}
