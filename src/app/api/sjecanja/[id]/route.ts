import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
type Params = { params: Promise<{ id: string }> };

const MAX_WORDS = 100;

function sanitizeHtmlBasic(html: string): string {
    return html
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
        .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
        .replace(/on\w+\s*=\s*'[^']*'/gi, "")
        .replace(/javascript:/gi, "");
}

function countWords(html: string): number {
    return html
        .replace(/<[^>]*>/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
}

function toSlug(personInfo: string): string {
    return String(personInfo)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function GET(_req: Request, { params }: Params) {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const item = await prisma.memory.findUnique({ where: { id } });
    if (!item) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: Params) {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date, personInfo, dateRange, content, author, imageUrl, status, publishedAt } = body || {};
    if (!date || !personInfo || !content || !author) {
        return NextResponse.json({ error: "Nedostaju podaci." }, { status: 400 });
    }

    const safeContent = sanitizeHtmlBasic(String(content || ""));
    if (countWords(safeContent) > MAX_WORDS) {
        return NextResponse.json({ error: "Sadržaj je predug." }, { status: 400 });
    }

    const nextStatus = status === "published" ? "published" : "draft";

    try {
        const updated = await prisma.memory.update({
            where: { id },
            data: {
                publishDate: date ? new Date(date) : null,
                personInfo,
                dateRange,
                content: safeContent,
                authorName: author,
                imageUrl: imageUrl ?? null,
                slug: toSlug(personInfo),
                status: nextStatus,
                publishedAt:
                    nextStatus === "published"
                        ? publishedAt
                            ? new Date(publishedAt)
                            : new Date()
                        : null,
            },
        });

        return NextResponse.json(updated);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Greška pri spremanju";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: Params) {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = body as { status?: "published" | "draft" };
    if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 });

    const updated = await prisma.memory.update({
        where: { id },
        data: {
            status,
            publishedAt: status === "published" ? new Date() : null,
        },
    });

    return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Params) {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.memory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
