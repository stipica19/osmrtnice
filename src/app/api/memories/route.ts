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
    const { date, personInfo, content, author, imageUrl } = body || {};

    if (!date || !personInfo || !content || !author) {
        return NextResponse.json({ error: "Nedostaju podaci." }, { status: 400 });
    }


    const created = await prisma.memory.create({
        data: {
            publishDate: date ? new Date(date) : undefined,
            personInfo,
            content,
            authorName: author,
            imageUrl: imageUrl ?? undefined,
        },
    });

    return NextResponse.json({ ok: true, id: created.id });
}
