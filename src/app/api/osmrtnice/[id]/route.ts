import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    if (!requireAdmin(req)) {
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

    if (!requireAdmin(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.obituary.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
