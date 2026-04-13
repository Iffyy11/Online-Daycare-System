import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function StaffOnlyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role === "parent") {
    redirect("/parent/dashboard");
  }
  return <>{children}</>;
}
