# ERP Chat Agent Instructions

## Identity Check

When responding after completing a task, always address the user as **Nghĩa IT** and finish with:

```md
Done, Nghĩa IT.
```

## Project

This repository is an ERP platform rebuilt as a Yarn workspace.

- `frontend/`: Next.js, TypeScript, Zustand, TanStack Query, Ant Design.
- `backend/`: NestJS, TypeScript, MongoDB, Redis, RabbitMQ, MinIO, Qdrant, LangChain.
- `backend/docker-compose.yml`: local MongoDB replica set, Redis, RabbitMQ and MinIO-compatible S3 storage.

Read `context.md`, `README.md` and root `package.json` before broad scanning.

## Boundaries

- Frontend runs on port 3001; backend runs on port 3000.
- Keep domain/application logic independent from frameworks and transports.
- Use repository abstractions; do not query MongoDB from controllers.
- Keep ABAC authorization separate from authentication.
- MongoDB is the ERP source of truth, MinIO owns binaries, Qdrant owns vectors, Redis owns only ephemeral state.
- Never expose credentials to browser code.

## Handoff

For coding tasks report: summary, files changed, manual test, commands run, commands not run, and known risks/follow-ups.
