const PROBE_ORIGIN = "https://local.invalid"

export function resolveLogoUrl(value: string): string | undefined {
    if(!value || value !== value.trim()) {
        return undefined;
    }
    try {
        if(value.startsWith("/")) {
            const url = new URL(value, PROBE_ORIGIN);
            if(url.origin !== PROBE_ORIGIN) {
                return undefined;
            }
            return `${url.pathname}${url.search}${url.hash}`;
        }
        const url = new URL(value);
        if (
            url.protocol !== "https:" ||
            url.username ||
            url.password
        ) {
            return undefined
        }
        return url.href;
    } catch {
        return undefined;
    }
}