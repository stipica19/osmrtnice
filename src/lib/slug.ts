export function createSlug(
    firstName?: string,
    lastName?: string,
    deathDate?: string
) {
    if (!firstName || !lastName || !deathDate) return ""

    const date = new Date(deathDate)
    if (isNaN(date.getTime())) return ""

    const datePart = date.toISOString().split("T")[0] // YYYY-MM-DD

    return `${firstName}-${lastName}-${datePart}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // ukloni dijakritiku
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
}
