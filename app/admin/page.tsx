import { redirect } from "next/navigation";
import { Dashboard } from "@/components/admin/Dashboard";
import { adminEmail, isAdmin } from "@/lib/admin-auth";
import { mailProvider } from "@/lib/mail";
import { storageAvailable } from "@/lib/storage";
import { listSubmissions, updateSubmission } from "@/lib/submissions";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ open?: string }> }) {
  const { open } = await searchParams;
  if (!(await isAdmin())) redirect(`/admin/login/${open ? `?open=${encodeURIComponent(open)}` : ""}`);
  // Opened from an email link: count it as read.
  if (open) await updateSubmission(open, { read: true }).catch(() => null);
  const items = await listSubmissions();
  return (
    <Dashboard
      initialItems={items}
      openId={open}
      email={adminEmail()}
      status={{ mail: mailProvider(), storage: storageAvailable() }}
    />
  );
}
