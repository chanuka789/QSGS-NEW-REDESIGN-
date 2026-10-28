"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

/** Sign-in screen for the submissions dashboard (one owner account, set in Railway). */
export function LoginForm({ email: defaultEmail, configured, failed }: { email: string; configured: boolean; failed?: boolean }) {
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | undefined>(failed ? "The email or password is incorrect." : undefined);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch("/api/admin/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Sign-in failed. Please try again.");
        return;
      }
      router.replace(`/admin/${window.location.search}`);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-brand p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo className="h-10 w-auto text-white" />
        <div>
          <p className="eyebrow !text-white/70">Submissions dashboard</p>
          <p className="t-h2 mt-4 max-w-md !text-white">Every CV, meeting request and quotation in one place.</p>
          <p className="t-body mt-4 max-w-md !text-white/75">Review submissions, open attachments, keep notes and reply to clients and candidates.</p>
        </div>
        <p className="t-xs !text-white/60">Private area · Quantity Surveying Global Solutions</p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          <Logo className="h-9 w-auto text-brand lg:hidden" />
          <h1 className="t-h2 mt-10 lg:mt-0">Sign in</h1>
          <p className="t-small mt-2 text-muted">Use the dashboard email and password set for this website.</p>

          {!configured && (
            <p role="status" className="t-small mt-6 rounded-[12px] bg-brand-50 px-4 py-3 text-ink-2">
              The dashboard is not set up yet. Add an <strong>ADMIN_PASSWORD</strong> variable (at least 12 characters) to the website service in Railway, then reload this page.
            </p>
          )}

          <form method="post" action="/api/admin/login/" onSubmit={onSubmit} className="mt-8 grid gap-5" noValidate>
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-2 t-small font-medium text-ink">Email</label>
              <input id="email" name="email" type="email" autoComplete="username" defaultValue={defaultEmail} required className="field bg-white" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="mb-2 t-small font-medium text-ink">Password</label>
              <div className="relative">
                <input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required autoFocus className="field w-full bg-white pr-12" />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-ink"
                >
                  {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {error && (
              <p role="alert" className="rounded-[12px] bg-[#c0392b]/8 px-4 py-3 t-small text-[#a3301f]">
                {error}
              </p>
            )}
            <button type="submit" disabled={loading || !configured} className="btn btn-primary btn-lg w-full justify-center disabled:opacity-60">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />} {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="t-xs mt-8 text-muted">Forgot the password? Change ADMIN_PASSWORD in Railway → website service → Variables. Saving it signs out every open session.</p>
        </div>
      </div>
    </div>
  );
}
