import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"

function parseDateInput(value: unknown): Date | null {
    if (!value) return null
    const raw = String(value).trim()
    if (!raw) return null

    if (/^\d{4}$/.test(raw)) {
        return new Date(`${raw}-01-01T00:00:00.000Z`)
    }

    const hr = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/)
    if (hr) {
        const [, d, m, y] = hr
        return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}T00:00:00.000Z`)
    }

    const parsed = new Date(raw)
    return Number.isNaN(parsed.getTime()) ? null : parsed
}

export async function GET() {
    const isAdmin = await requireAdmin()
    const items = await prisma.obituary.findMany({
        where: isAdmin ? undefined : { status: "published" },
        orderBy: isAdmin
            ? [{ createdAt: "desc" }]
            : [{ deathDate: "desc" }, { createdAt: "desc" }],
    })
    return NextResponse.json(items)
}

export async function POST(req: Request) {
    if (!(await requireAdmin())) {
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

                birthDate: parseDateInput(body.birthDate),
                deathDate: parseDateInput(body.deathDate),

                slug: body.slug,
                status: body.status || "draft",
                publishedAt: body.status === "published" ? new Date() : null,

                contentJson: body.contentJson,
                contentJson1: body.contentJson1,
                image: body.image ?? null,
            },
        })

        return NextResponse.json(created)
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to create obituary";
        console.error("Error creating obituary:", error)
        return NextResponse.json(
            { error: message },
            { status: 500 }
        )
    }
}
