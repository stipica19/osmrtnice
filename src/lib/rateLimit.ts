type Bucket = {
    count: number;
    resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function rateLimit(
    key: string,
    max: number,
    windowMs: number,
): { ok: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const current = buckets.get(key);

    if (!current || now > current.resetAt) {
        const next: Bucket = { count: 1, resetAt: now + windowMs };
        buckets.set(key, next);
        return { ok: true, remaining: max - 1, resetAt: next.resetAt };
    }

    if (current.count >= max) {
        return { ok: false, remaining: 0, resetAt: current.resetAt };
    }

    current.count += 1;
    buckets.set(key, current);
    return { ok: true, remaining: max - current.count, resetAt: current.resetAt };
}
