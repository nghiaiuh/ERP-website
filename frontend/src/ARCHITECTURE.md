# Frontend architecture boundaries

The frontend follows a one-way dependency flow:

```text
design-system
    -> components/ui
    -> components/patterns
    -> features
    -> app
```

Imports must not point back toward a higher application layer.

## Design system

`design-system/` owns tokens, framework adapters and styling utilities. It does not import React components, features, stores, API clients or query code.

## Shared components

`components/ui/` contains thin Ant Design primitives. These components do not know about business features, Zustand, TanStack Query or translations.

`components/patterns/` composes UI primitives into reusable ERP interface patterns. Translated strings are passed through props instead of being read from `next-intl` inside shared components.

Import shared components through their component-level public index:

```ts
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/patterns/data-table';
```

Do not import implementation files directly:

```ts
import { Button } from '@/components/ui/button/button';
```

## Features

Features own business-facing UI, queries and local orchestration. A feature exposes its supported API from `features/<name>/index.ts`.

```ts
import { HealthStatus } from '@/features/system-health';
```

App routes and other features must not import another feature's internal `components/`, `hooks/` or `api/` files.

## Ant Design wrappers

Application and feature code must use the shared wrappers for `Button`, `Checkbox`, `Drawer`, `Input`, `Modal`, `Select`, `Switch` and `Table`. Direct Ant Design usage remains allowed for components that do not have a shared wrapper yet, such as `Layout`, `Alert`, `Card`, `Spin`, `Tag` and `Typography`.

## Server and client state

Pages and layouts are Server Components by default. Add `'use client'` only for event handlers, browser APIs, Zustand, TanStack Query or interactive third-party components.

TanStack Query owns remote server state. Zustand owns ephemeral client UI state. Do not duplicate query data in Zustand.

## Internationalization

App and feature layers resolve translations. Shared components receive translated labels through props so that they remain portable and testable.

## Motion and WebGL

GSAP, Three.js and React Three Fiber are restricted to the future marketing layer. They must not be imported by ERP routes, features, shared UI or providers.

## Authorization

Frontend authorization controls presentation only. Backend ABAC remains authoritative. Add CASL only after the authenticated-principal and permission contracts exist.
