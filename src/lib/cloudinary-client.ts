export type CloudinaryUploadResult = {
    public_id: string
    secure_url: string
    width: number
    height: number
}

export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
    const signRes = await fetch("/api/uploads/sign", { method: "POST" })
    if (!signRes.ok) throw new Error("Ne mogu dobiti potpis za upload.")

    const { signature, timestamp, folder, apiKey, cloudName } = await signRes.json()

    const fd = new FormData()
    fd.append("file", file)
    fd.append("api_key", apiKey)
    fd.append("timestamp", String(timestamp))
    fd.append("folder", folder)
    fd.append("signature", signature)

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: fd,
    })

    if (!uploadRes.ok) {
        const err = await uploadRes.text()
        throw new Error(err)
    }

    return uploadRes.json()
}
