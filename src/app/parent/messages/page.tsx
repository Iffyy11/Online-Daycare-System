import { getSession } from "@/lib/auth";
import { ChatRoom } from "@/components/chat-room";
import { readDb } from "@/lib/db";

export default async function ParentMessagesPage() {
  const session = await getSession();
  const db = await readDb();
  const mine = db.messages.filter((m) => m.threadParentUserId === session!.userId);

  return (
    <>
      <header className="space-y-2 border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">Inbox</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Messages</h1>
        <p className="max-w-2xl text-slate-600">
          Private thread for your account only. When the center messages you, it appears here — not on other
          parents&apos; screens.
        </p>
      </header>
      <div className="mt-8">
        <ChatRoom initialMessages={mine} />
      </div>
    </>
  );
}
