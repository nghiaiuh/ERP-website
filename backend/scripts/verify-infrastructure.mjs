import { randomUUID } from 'node:crypto';
import amqp from 'amqplib';
import Redis from 'ioredis';
import { Client as MinioClient } from 'minio';
import mongoose from 'mongoose';

const results = {};
let redis;
let rabbitConnection;

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

async function verifyMongo() {
  await mongoose.connect(required('MONGO_URI'), {
    serverSelectionTimeoutMS: 10_000,
  });

  const database = mongoose.connection.db;
  if (!database) {
    throw new Error('MongoDB connection has no database handle');
  }

  const hello = await database.admin().command({ hello: 1 });
  if (hello.setName !== 'rs0' || hello.isWritablePrimary !== true) {
    throw new Error('MongoDB rs0 is not a writable primary');
  }

  const session = await mongoose.startSession();
  const marker = randomUUID();

  try {
    await session.withTransaction(async () => {
      const collection = database.collection('infrastructure_checks');
      await collection.insertOne({ marker, createdAt: new Date() }, { session });

      const stored = await collection.findOne({ marker }, { session });
      if (!stored) {
        throw new Error('MongoDB transaction could not read its own write');
      }

      await collection.deleteOne({ marker }, { session });
    });
  } finally {
    await session.endSession();
  }

  results.mongo = {
    ok: true,
    replicaSet: hello.setName,
    primary: hello.primary,
    transactions: true,
  };
}

async function verifyRedis() {
  redis = new Redis(required('REDIS_URL'), {
    connectTimeout: 10_000,
    maxRetriesPerRequest: 1,
  });

  const pong = await redis.ping();
  if (pong !== 'PONG') {
    throw new Error(`Unexpected Redis PING response: ${pong}`);
  }

  const key = `${process.env.REDIS_KEY_PREFIX ?? 'ai-crm:'}infra-check`;
  await redis.set(key, 'ok', 'EX', 30);
  const value = await redis.get(key);
  await redis.del(key);

  if (value !== 'ok') {
    throw new Error('Redis read/write verification failed');
  }

  results.redis = { ok: true, cacheReadWrite: true };
}

async function verifyRabbitMq() {
  rabbitConnection = await amqp.connect(required('RABBITMQ_URL'));
  const channel = await rabbitConnection.createChannel();
  await channel.close();
  results.rabbitmq = { ok: true, authenticatedConnection: true };
}

async function verifyObjectStorage() {
  const client = new MinioClient({
    endPoint: required('STORAGE_ENDPOINT'),
    port: Number(process.env.STORAGE_PORT ?? 9000),
    useSSL: process.env.STORAGE_USE_SSL === 'true',
    accessKey: required('STORAGE_ACCESS_KEY'),
    secretKey: required('STORAGE_SECRET_KEY'),
  });
  const bucket = required('STORAGE_BUCKET');

  if (!(await client.bucketExists(bucket))) {
    throw new Error(`Object storage bucket '${bucket}' does not exist`);
  }

  const objectName = `infrastructure-checks/${randomUUID()}.txt`;
  await client.putObject(bucket, objectName, Buffer.from('ok'));
  await client.statObject(bucket, objectName);
  await client.removeObject(bucket, objectName);

  results.storage = { ok: true, bucket, objectReadWrite: true };
}

try {
  await verifyMongo();
  await verifyRedis();
  await verifyRabbitMq();
  await verifyObjectStorage();
  console.log(JSON.stringify(results, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await Promise.allSettled([
    mongoose.disconnect(),
    redis?.quit(),
    rabbitConnection?.close(),
  ]);
}
