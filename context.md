# ERP Context

## Current architecture

- Yarn 4 workspace with `frontend/` and `backend/`.
- Backend: NestJS + MongoDB/Mongoose, Redis, RabbitMQ, MinIO, Qdrant client and LangChain.
- Frontend: Next.js App Router + Ant Design, Zustand and TanStack Query.
- Local infrastructure is defined in `backend/docker-compose.yml` with Compose project name `ai-crm`.
- MongoDB runs as single-node replica set `rs0`; host clients use `directConnection=true`.
- All infrastructure ports bind to `127.0.0.1` only.
- Frontend runs on port 3001; backend runs on port 3000.

## Backend boundaries

- Keep domain and application code independent from NestJS, Mongoose and transport details where practical.
- Controllers call use cases; use cases depend on repository ports.
- Mongo repositories belong to infrastructure.
- Authentication establishes the principal; ABAC decides whether that principal can perform an action on a resource.
- Long-running AI and document tasks should be published to RabbitMQ rather than processed in HTTP requests.
- Redis is for cache, locks and ephemeral state, never authoritative ERP data.
- MinIO/S3-compatible storage stores binary objects; MongoDB stores metadata and ownership.
- Qdrant stores embeddings and retrieval indexes; MongoDB remains the source of truth.

## Startup

```bash
corepack yarn install
corepack yarn docker:up
corepack yarn dev
```
