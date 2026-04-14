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
    const first = parsed.error.flatten().fieldErrors;
    const hint =
      first.message?.[0] ??
      first.name?.[0] ??
      first.email?.[0] ??
      "Check all fields (message needs at least 10 characters).";
    return NextResponse.json({ error: hint }, { status: 400 });
  }

  let emailDispatched = false;

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    try {
      await sendContactViaResend(parsed.data);
      emailDispatched = true;
    } catch (err) {
      console.error("[contact] Resend failed:", err);
      await appendContactLead({ ...parsed.data, emailDispatched: false });
      const resendMsg = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        {
          error: resendMsg,
          hint:
            "In Resend: Domains must be verified before using noreply@yourdomain.com. For quick tests, unset RESEND_FROM or set it exactly to onboarding@resend.dev and send to an allowed recipient.",
        },
        { status: 502 },
      );
    }
  }

  const leadSaved = (await appendContactLead({ ...parsed.data, emailDispatched })) !== null;

  return NextResponse.json({
    ok: true,
    emailDispatched,
    leadSaved,
  });
}
