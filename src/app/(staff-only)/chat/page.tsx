import { AppPageShell } from "@/components/app-page-shell";
import { StaffChatRoom } from "@/components/staff-chat-room";
import { readDb } from "@/lib/db";

export default async function StaffChatPage() {
  const db = await readDb();
  const parents = db.users.filter((u) => u.role === "parent").map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
  }));

  return (
    <AppPageShell>
      <header className="space-y-2 border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Communication
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Parent messaging
        </h1>
        <p className="max-w-2xl text-slate-600">
          Choose a registered parent — your message appears only in their portal. Parents must sign up
          first so they appear in this list.
        </p>
      </header>

      <div className="mt-8">
        <StaffChatRoom initialMessages={db.messages} parents={parents} />
      </div>
    </AppPageShell>
  );
}
