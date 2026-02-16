export type ObituaryPreviewSettings = {
    fontFamily: "serif" | "sans" | "classic";
    contentSize: "sm" | "md" | "lg";
    familySize: "sm" | "md" | "lg";
    imageFit: "cover" | "contain";
};

export const DEFAULT_OBITUARY_SETTINGS: ObituaryPreviewSettings = {
    fontFamily: "serif",
    contentSize: "md",
    familySize: "md",
    imageFit: "cover",
};

export type ObituaryFormValues = {
    firstName: string;
    lastName: string;
    djevojackoPrezime?: string;
    spol?: "M" | "Z";
    birthDate?: string;
    deathDate?: string;
    slug: string;
    status: "published" | "draft";
    publishedAt?: string;
    contentJson: unknown;
    contentJson1: unknown;
    image?: string;
    settings: ObituaryPreviewSettings;
};

export type ObituaryPreviewModel = {
    templateLeftUrl?: string;
    portrait?: { secureUrl: string } | null;
    announcementDate?: string;
    firstName?: string;
    lastName?: string;
    djevojackoPrezime?: string;
    spol?: "M" | "Z";
    birthDate?: string;
    deathDate?: string;
    contentJson?: unknown;
    contentJson1?: unknown;
    footerText?: string;
    settings?: ObituaryPreviewSettings;
};

export function mapObituaryFormToPreview(
    values: ObituaryFormValues,
): ObituaryPreviewModel {
    return {
        templateLeftUrl: "/templates/cross.jpg",
        portrait: values.image ? { secureUrl: values.image } : null,
        announcementDate: values.deathDate,
        firstName: values.firstName,
        lastName: values.lastName,
        djevojackoPrezime: values.djevojackoPrezime,
        spol: values.spol,
        birthDate: values.birthDate,
        deathDate: values.deathDate,
        contentJson: values.contentJson,
        contentJson1: values.contentJson1,
        footerText: values.spol === "Z" ? "Počivala u miru Božjem!" : "Počivao u miru Božjem!",
        settings: values.settings,
    };
}
