import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ locale: explicitLocale }) => {
    const requestedLocale = explicitLocale ?? (await rootParams.locale())

    const locale = hasLocale(
        routing.locales,
        requestedLocale,
    ) ? requestedLocale : routing.defaultLocale;
    return {
        locale,
        messages: (
            await import(`../../locales/${locale}.json`)
        ).default,
    };
})