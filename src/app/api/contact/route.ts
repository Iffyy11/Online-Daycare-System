import { NextResponse } from "next/server";
import { z } from "zod";
import { appendContactLead } from "@/lib/contact-leads";
import { sendContactViaResend } from "@/lib/send-contact-email";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }

  let emailDispatched = false;

  if (process.env.RESEND_API_KEY) {
    try {
      await sendContactViaResend(parsed.data);
      emailDispatched = true;
    } catch (err) {
      console.error("[contact] Resend failed:", err);
      await appendContactLead({ ...parsed.data, emailDispatched: false });
      return NextResponse.json(
        { error: "Could not send email right now. Please call us or try again in a few minutes." },
        { status: 502 },
      );
    }
  }

  await appendContactLead({ ...parsed.data, emailDispatched });

  return NextResponse.json({
    ok: true,
    emailDispatched,
  });
}
