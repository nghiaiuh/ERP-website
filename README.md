# AI CRM Platform

Yarn workspace gồm hai ứng dụng:

- `backend/`: NestJS, TypeScript, MongoDB/Mongoose, Redis, RabbitMQ, object storage tương thích MinIO/S3, Qdrant client và LangChain.
- `frontend/`: Next.js App Router, TypeScript, Zustand, TanStack Query và Ant Design.

## Yêu cầu

- Node.js 22+
- Corepack/Yarn 4
- Docker Desktop với Docker Compose

## Chuẩn bị môi trường

```bash
corepack enable
corepack yarn install
Copy-Item backend/.env.example backend/.env
```

`backend/.env` đã được Git ignore. Thay toàn bộ giá trị `change_me_*` trước khi dùng; không commit secret thật.

## Khởi động

```bash
corepack yarn docker:config
corepack yarn docker:up
corepack yarn docker:ps
corepack yarn infra:verify
corepack yarn dev
```

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- Health check: http://localhost:3000/api/health
- RabbitMQ Management: http://localhost:15672
- Object Storage Console: http://localhost:9001

Credential local nằm trong `backend/.env`.

## Hạ tầng local

Compose nằm tại `backend/docker-compose.yml`, project name là `ai-crm` và chỉ có đúng bốn service. Tất cả port chỉ bind trên `127.0.0.1`.

| Service | Host port | Vai trò |
| --- | ---: | --- |
| MongoDB | 27017 | Source of truth, replica set `rs0`, transactions/outbox |
| Redis | 6379 | Cache và BullMQ |
| RabbitMQ | 5672 / 15672 | Event bus và management UI |
| MinIO-compatible S3 | 9000 / 9001 | Object API và console |

MongoDB dùng application user riêng thay vì root. `MONGO_URI` kết nối từ NestJS chạy trên host bằng `directConnection=true`, tránh việc driver nhận hostname nội bộ không resolve được trên Windows.

Keyfile replica set được tạo ngẫu nhiên một lần trong named volume `mongo_config`; keyfile không nằm trong Git. Healthcheck Mongo tự gọi `rs.initiate()` idempotent và chỉ báo healthy sau khi node trở thành PRIMARY.

Object storage dùng image được ghim `pgsty/silo:RELEASE.2026-09-16T00-00-00Z`. Đây là fork MinIO-compatible đang được duy trì, giữ S3 API, `MINIO_*` variables và định dạng lưu trữ tương thích. Script khởi động tạo bucket `crm` bằng `mcli mb --ignore-existing` ngay trong cùng container, nên không cần container thứ năm.

## Kiểm tra hạ tầng từ host

```bash
corepack yarn infra:verify
```

Script kiểm tra:

- MongoDB là PRIMARY của `rs0` và transaction commit thành công.
- Redis PING cùng thao tác ghi/đọc/xoá.
- RabbitMQ authenticated AMQP connection.
- Bucket object storage tồn tại và cho phép ghi/xoá object.

Kiểm tra thủ công:

```bash
docker compose --env-file backend/.env -f backend/docker-compose.yml ps
docker compose --env-file backend/.env -f backend/docker-compose.yml logs mongo
docker compose --env-file backend/.env -f backend/docker-compose.yml logs redis
docker compose --env-file backend/.env -f backend/docker-compose.yml logs rabbitmq
docker compose --env-file backend/.env -f backend/docker-compose.yml logs minio
```

## Dừng services

```bash
corepack yarn docker:down
```

Lệnh trên không xoá named volumes. Chỉ dùng `docker compose down --volumes` khi chủ động muốn xoá toàn bộ dữ liệu local.

## Qdrant

Qdrant không nằm trong Compose bốn container. Backend nhận Qdrant qua `QDRANT_URL`, có thể trỏ tới Qdrant Cloud hoặc instance chạy riêng.

## Kiến trúc backend

```text
domain          entity, policy, repository port
application     use case, command/query orchestration
infrastructure  Mongo repository, external adapters
presentation    HTTP controller, DTO
```

Controller không truy cập MongoDB trực tiếp. Application layer phụ thuộc repository abstraction; infrastructure layer triển khai abstraction bằng Mongoose. Authentication tạo principal, ABAC quyết định principal được thao tác tài nguyên nào.

## Quality commands

```bash
corepack yarn lint
corepack yarn typecheck
corepack yarn test
corepack yarn build
```

## Frontend UI workshop

Storybook hiển thị các UI primitives và ERP patterns độc lập với application routes. Nó sử dụng cùng Design System provider, Ant Design theme và CSS tokens như frontend.

```bash
corepack yarn workspace @erp/frontend storybook
corepack yarn workspace @erp/frontend storybook:build
corepack yarn workspace @erp/frontend test
```

- Storybook: http://localhost:6006
- Component tests chạy bằng Vitest, React Testing Library và jsdom.
- Stories nằm cạnh component dưới dạng `*.stories.tsx`; test component nằm trong `*.test.tsx`.
