import { getTranslations } from 'next-intl/server';

import { HealthStatus } from '@/features/system-health';

export default async function WorkspacePage() {
  const t = await getTranslations('Workspace');

  const services = [
    {
      name: t('services.mongodb.name'),
      detail: t('services.mongodb.detail'),
      shortName: 'DB',
    },
    {
      name: t('services.redis.name'),
      detail: t('services.redis.detail'),
      shortName: 'RD',
    },
    {
      name: t('services.rabbitmq.name'),
      detail: t('services.rabbitmq.detail'),
      shortName: 'MQ',
    },
    {
      name: t('services.minio.name'),
      detail: t('services.minio.detail'),
      shortName: 'S3',
    },
  ];

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t('readyTitle')}
        </h1>
        <p className="mt-2 max-w-3xl text-muted">
          {t('readyDescription')}
        </p>
      </header>

      <HealthStatus />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => (
          <article
            key={service.name}
            className="rounded-lg border border-border bg-surface p-5 shadow-sm"
          >
            <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-brand font-semibold text-white">
              {service.shortName}
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {service.name}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {service.detail}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
