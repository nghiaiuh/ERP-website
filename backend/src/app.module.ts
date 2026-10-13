import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AiModule } from './modules/ai/ai.module';
import { AuthorizationModule } from './core/authorization/authorization.module';
import { configuration } from './infrastructure/config/configuration';
import { validateEnvironment } from './infrastructure/config/environment.validation';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validate: validateEnvironment,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('mongo.uri'),
      }),
    }),
    AuthorizationModule,
    InfrastructureModule,
    HealthModule,
    UsersModule,
    AiModule,
  ],
})
export class AppModule {}
