import { Global, Module } from '@nestjs/common';
import { AbacGuard } from './abac.guard';
import { AbacService } from './abac.service';

@Global()
@Module({
  providers: [AbacService, AbacGuard],
  exports: [AbacService, AbacGuard],
})
export class AuthorizationModule {}
