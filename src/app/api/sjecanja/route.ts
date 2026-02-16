import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { getRequestIp } from "@/lib/request";

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

export async function GET() {
    const items = await prisma.memory.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
}

export async function POST(req: Request) {
    const body = await req.json();
    const { date, personInfo, dateRange, content, author, imageUrl, website } = body || {};

    if (website) {
        return NextResponse.json({ error: "Neispravan zahtjev." }, { status: 400 });
    }

    const ip = getRequestIp(req);
    const limit = rateLimit(`memory:${ip}`, 3, 10 * 60 * 1000);
    if (!limit.ok) {
        return NextResponse.json({ error: "Previše zahtjeva. Pokušajte kasnije." }, { status: 429 });
    }

    if (!date || !personInfo || !content || !author) {
        return NextResponse.json({ error: "Nedostaju podaci." }, { status: 400 });
    }

    const slug = String(personInfo)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const safeContent = sanitizeHtmlBasic(String(content || ""));
    if (countWords(safeContent) > MAX_WORDS) {
        return NextResponse.json({ error: "Sadržaj je predug." }, { status: 400 });
    }

    const created = await prisma.memory.create({
        data: {
            publishDate: date ? new Date(date) : undefined,
            personInfo,
            dateRange,
            content: safeContent,
            authorName: author,
            imageUrl: imageUrl ?? undefined,
            slug,
        },
    });

    return NextResponse.json({ ok: true, id: created.id });
}
