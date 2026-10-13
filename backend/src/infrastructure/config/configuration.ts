export function configuration() {
  const corsOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:3001')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    app: {
      environment: process.env.NODE_ENV ?? 'development',
      port: Number(process.env.PORT ?? 3000),
      apiPrefix: process.env.API_PREFIX ?? 'api',
      corsOrigins,
    },
    mongo: {
      uri:
        process.env.MONGO_URI ??
        process.env.MONGODB_URI ??
        'mongodb://ai_crm_app:change_me_mongo_app@localhost:27017/ai_crm?authSource=ai_crm&replicaSet=rs0&directConnection=true',
    },
    redis: {
      url: process.env.REDIS_URL ?? 'redis://localhost:6379/0',
      jobsUrl: process.env.JOBS_REDIS_URL ?? 'redis://localhost:6379/1',
      keyPrefix: process.env.REDIS_KEY_PREFIX ?? 'ai-crm:',
    },
    rabbitmq: {
      url:
        process.env.RABBITMQ_URL ??
        'amqp://ai_crm:change_me_rabbitmq@localhost:5672/ai-crm',
      queue: process.env.RABBITMQ_QUEUE ?? 'ai-crm.events',
    },
    minio: {
      endpoint: process.env.STORAGE_ENDPOINT ?? 'localhost',
      port: Number(process.env.STORAGE_PORT ?? 9000),
      useSsl: process.env.STORAGE_USE_SSL === 'true',
      accessKey: process.env.STORAGE_ACCESS_KEY ?? 'ai_crm_storage',
      secretKey: process.env.STORAGE_SECRET_KEY ?? 'change_me_storage_secret',
      bucket: process.env.STORAGE_BUCKET ?? 'crm',
    },
    qdrant: {
      url: process.env.QDRANT_URL ?? 'http://localhost:6333',
      apiKey: process.env.QDRANT_API_KEY || undefined,
      collection: process.env.QDRANT_COLLECTION ?? 'crm-documents',
    },
  };
}
