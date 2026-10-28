import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { adminConfigured, adminEmail, isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect("/admin/");
  const { error } = await searchParams;
  return <LoginForm email={adminEmail()} configured={adminConfigured()} failed={error === "1"} />;
}
