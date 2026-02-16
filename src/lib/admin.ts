export const ADMIN_HEADER = "x-admin-key";

export function requireAdmin(req: Request): boolean {
    const expected = process.env.ADMIN_KEY;
    if (!expected) return true;
    const provided = req.headers.get(ADMIN_HEADER) || "";
    return provided === expected;
}

export function getAdminKeyFromStorage(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("adminKey");
}

export function setAdminKeyInStorage(value: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("adminKey", value);
}
