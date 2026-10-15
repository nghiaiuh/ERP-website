import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

export default async function LandingPage() {
  const t = await getTranslations('Landing');

  return (
    <main className="min-h-screen bg-page px-6 py-24 text-foreground">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 font-semibold text-brand">
          CRM Platform
        </p>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight">
          {t('title')}
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted">
          {t('description')}
        </p>

        <Link
          href="/app"
          className="mt-8 inline-flex rounded-md bg-brand px-5 py-3 font-semibold text-white"
        >
          {t('openApp')}
        </Link>
      </div>
    </main>
  );
}