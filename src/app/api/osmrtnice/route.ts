import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"

export async function GET() {
    const items = await prisma.obituary.findMany({
        orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(items)
}

export async function POST(req: Request) {
    if (!requireAdmin(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()

        console.log("Received body:", JSON.stringify(body, null, 2))

        // Validacija obaveznih polja
        if (!body.firstName || !body.lastName) {
            return NextResponse.json(
                { error: "firstName i lastName su obavezni", received: body },
                { status: 400 }
            )
        }

        if (!body.slug) {
            return NextResponse.json(
                { error: "slug je obavezan", received: body },
                { status: 400 }
            )
        }

        if (!body.contentJson || !body.contentJson1) {
            return NextResponse.json(
                { error: "contentJson i contentJson1 su obavezni", received: body },
                { status: 400 }
            )
        }

        const created = await prisma.obituary.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                djevojackoPrezime: body.djevojackoPrezime || null,
                spol: body.spol ?? null,

                birthDate: body.birthDate ? new Date(body.birthDate) : null,
                deathDate: body.deathDate ? new Date(body.deathDate) : null,

                slug: body.slug,
                status: body.status || "draft",
                publishedAt: body.status === "published" ? new Date() : null,

                contentJson: body.contentJson,
                contentJson1: body.contentJson1,
                image: body.image ?? null,
            },
        })

        return NextResponse.json(created)
    } catch (error: any) {
        console.error("Error creating obituary:", error)
        return NextResponse.json(
            { error: error.message || "Failed to create obituary" },
            { status: 500 }
        )
    }
}
