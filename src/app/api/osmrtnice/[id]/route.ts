import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

type Params = { params: Promise<{ id: string }> };

function parseDateInput(value: unknown): Date | null {
    if (!value) return null;
    const raw = String(value).trim();
    if (!raw) return null;

    if (/^\d{4}$/.test(raw)) {
        return new Date(`${raw}-01-01T00:00:00.000Z`);
    }

    const hr = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/);
    if (hr) {
        const [, d, m, y] = hr;
        return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}T00:00:00.000Z`);
    }

    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function GET(_req: Request, { params }: Params) {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const item = await prisma.obituary.findUnique({ where: { id } });
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

    if (!body.firstName || !body.lastName || !body.slug) {
        return NextResponse.json(
            { error: "firstName, lastName i slug su obavezni" },
            { status: 400 },
        );
    }

    if (!body.contentJson || !body.contentJson1) {
        return NextResponse.json(
            { error: "contentJson i contentJson1 su obavezni" },
            { status: 400 },
        );
    }

    const nextStatus = body.status === "published" ? "published" : "draft";

    try {
        const updated = await prisma.obituary.update({
            where: { id },
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                djevojackoPrezime: body.djevojackoPrezime || null,
                spol: body.spol ?? null,
                birthDate: parseDateInput(body.birthDate),
                deathDate: parseDateInput(body.deathDate),
                slug: body.slug,
                status: nextStatus,
                publishedAt:
                    nextStatus === "published"
                        ? body.publishedAt
                            ? new Date(body.publishedAt)
                            : new Date()
                        : null,
                contentJson: body.contentJson,
                contentJson1: body.contentJson1,
                image: body.image ?? null,
            },
        });

        return NextResponse.json(updated);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to update obituary";
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
    if (!status) {
        return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    const updated = await prisma.obituary.update({
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

    await prisma.obituary.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
