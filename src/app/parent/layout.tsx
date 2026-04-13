import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ParentPageShell } from "@/components/parent-page-shell";

export default async function ParentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "parent") {
    redirect("/dashboard");
  }
  return <ParentPageShell>{children}</ParentPageShell>;
}
