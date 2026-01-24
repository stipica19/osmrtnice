import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST() {
    const timestamp = Math.floor(Date.now() / 1000)
    const folder = process.env.CLOUDINARY_FOLDER || "obituaries"

    const paramsToSign: Record<string, string | number> = { folder, timestamp }

    const toSign = Object.keys(paramsToSign)
        .sort()
        .map((k) => `${k}=${paramsToSign[k]}`)
        .join("&")

    const signature = crypto
        .createHash("sha1")
        .update(toSign + process.env.CLOUDINARY_API_SECRET)
        .digest("hex")

    return NextResponse.json({
        timestamp,
        folder,
        signature,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    })
}
