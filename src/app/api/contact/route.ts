import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    if (!to || !from || !process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Mail servis nije konfigurisan." },
        { status: 500 },
      );
    }

    await resend.emails.send({
      from,
      to,
      subject: "Kontakt forma: " + String(subject),
      replyTo: String(email),
      html:
        "<h2>Nova poruka sa kontakt forme</h2>" +
        "<p><strong>Ime:</strong> " +
        String(name) +
        "</p>" +
        "<p><strong>Email:</strong> " +
        String(email) +
        "</p>" +
        "<p><strong>Naslov:</strong> " +
        String(subject) +
        "</p>" +
        "<p><strong>Poruka:</strong></p>" +
        "<p>" +
        String(message).replace(/\n/g, "<br/>") +
        "</p>",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Greska pri slanju poruke.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
