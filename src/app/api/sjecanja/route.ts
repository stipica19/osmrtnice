import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const items = await prisma.memory.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
}

export async function POST(req: Request) {
    const body = await req.json();
    const { date, personInfo, dateRange, content, author, imageUrl } = body || {};

    if (!date || !personInfo || !content || !author) {
        return NextResponse.json({ error: "Nedostaju podaci." }, { status: 400 });
    }

    const slug = String(personInfo)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const created = await prisma.memory.create({
        data: {
            publishDate: date ? new Date(date) : undefined,
            personInfo,
            dateRange,
            content,
            authorName: author,
            imageUrl: imageUrl ?? undefined,
            slug,
        },
    });

    return NextResponse.json({ ok: true, id: created.id });
}
