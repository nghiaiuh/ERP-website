import { Global, Module, type Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QdrantClient } from '@qdrant/js-client-rest';
import Redis from 'ioredis';
import { Client as MinioClient } from 'minio';
import {
  MINIO_CLIENT,
  QDRANT_CLIENT,
  RABBITMQ_CLIENT,
  REDIS_CLIENT,
} from './tokens';

const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) =>
    new Redis(config.getOrThrow<string>('redis.url'), {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
    }),
};

const minioProvider: Provider = {
  provide: MINIO_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) =>
    new MinioClient({
      endPoint: config.getOrThrow<string>('minio.endpoint'),
      port: config.getOrThrow<number>('minio.port'),
      useSSL: config.getOrThrow<boolean>('minio.useSsl'),
      accessKey: config.getOrThrow<string>('minio.accessKey'),
      secretKey: config.getOrThrow<string>('minio.secretKey'),
    }),
};

const qdrantProvider: Provider = {
  provide: QDRANT_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) =>
    new QdrantClient({
      url: config.getOrThrow<string>('qdrant.url'),
      apiKey: config.get<string>('qdrant.apiKey'),
      checkCompatibility: false,
    }),
};

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RABBITMQ_CLIENT,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.getOrThrow<string>('rabbitmq.url')],
            queue: config.getOrThrow<string>('rabbitmq.queue'),
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  providers: [redisProvider, minioProvider, qdrantProvider],
  exports: [
    ClientsModule,
    REDIS_CLIENT,
    MINIO_CLIENT,
    QDRANT_CLIENT,
  ],
})
export class InfrastructureModule {}
