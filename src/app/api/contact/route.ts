import { NextResponse } from "next/server";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message, website } = body ?? {};

    if (website) {
      return NextResponse.json(
        { error: "Neispravan zahtjev." },
        { status: 400 },
      );
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Sva polja su obavezna." },
        { status: 400 },
      );
    }

    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;
    const mailjetApiKey = process.env.MAILJET_API_KEY;
    const mailjetApiSecret = process.env.MAILJET_API_SECRET;

    if (!to || !from || !mailjetApiKey || !mailjetApiSecret) {
      return NextResponse.json(
        { error: "Mail servis nije konfigurisan." },
        { status: 500 },
      );
    }

    const payload = {
      Messages: [
        {
          From: {
            Email: from,
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: "Poruka sa internet stranice: " + String(subject),
          ReplyTo: {
            Email: String(email),
            Name: String(name),
          },
          HTMLPart:
            "<h2>Nova poruka sa internet stranice</h2>" +
            "<p><strong>Ime:</strong> " +
            escapeHtml(String(name)) +
            "</p>" +
            "<p><strong>Email:</strong> " +
            escapeHtml(String(email)) +
            "</p>" +
            "<p><strong>Naslov:</strong> " +
            escapeHtml(String(subject)) +
            "</p>" +
            "<p><strong>Poruka:</strong></p>" +
            "<p>" +
            escapeHtml(String(message)).replace(/\n/g, "<br/>") +
            "</p>",
        },
      ],
    };

    const auth = Buffer.from(`${mailjetApiKey}:${mailjetApiSecret}`).toString(
      "base64",
    );

    const response = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json(
        { error: `Mailjet greška: ${errorBody}` },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Greska pri slanju poruke.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
