import { LoginForm } from "@/app/login/login-form";

type Props = { searchParams: Promise<{ registered?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <LoginForm registered={sp.registered === "1"} />;
}
