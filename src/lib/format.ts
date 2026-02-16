export function formatDateHr(input?: string | Date | null): string {
    if (!input) return "";
    const dateObj = typeof input === "string" ? new Date(input) : input;
    if (isNaN(dateObj.getTime())) return "";
    return dateObj.toLocaleDateString("hr-HR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function formatYear(input?: string | Date | null): string {
    if (!input) return "";
    const dateObj = typeof input === "string" ? new Date(input) : input;
    if (isNaN(dateObj.getTime())) return "";
    return String(dateObj.getFullYear());
}
