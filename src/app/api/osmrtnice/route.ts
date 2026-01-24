import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const items = await prisma.obituary.findMany({
        orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(items)
}

export async function POST(req: Request) {
    const body = await req.json()

    const created = await prisma.obituary.create({
        data: {
            firstName: body.firstName,
            lastName: body.lastName,
            djevojackoPrezime: body.djevojackoPrezime || null,
            spol: body.spol ?? null,

            birthDate: body.birthDate ? new Date(body.birthDate) : null,
            deathDate: body.deathDate ? new Date(body.deathDate) : null,

            slug: body.slug,
            status: body.status,
            publishedAt: body.status === "published" ? new Date() : null,

            contentJson: body.contentJson,
            contentJson1: body.contentJson1,
            image: body.image ?? null,
        },
    })

    return NextResponse.json(created)
}
