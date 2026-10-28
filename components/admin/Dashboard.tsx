"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Briefcase,
  CalendarClock,
  Check,
  Download,
  ExternalLink,
  FileText,
  Inbox,
  Loader2,
  LogOut,
  Mail,
  MailOpen,
  Paperclip,
  Phone,
  RefreshCw,
  Search,
  Star,
  Trash2,
  X,
  Calculator,
  CircleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import type { Submission, SubmissionKind } from "@/lib/submissions";
import { cn } from "@/lib/utils";

type View = "inbox" | "unread" | "starred" | SubmissionKind | "archived";

const KIND: Record<SubmissionKind, { label: string; short: string; icon: typeof Briefcase; tone: string }> = {
  careers: { label: "Job applications", short: "Job application", icon: Briefcase, tone: "text-[#7a4b00] bg-[#fff4e0]" },
  meeting: { label: "Meeting requests", short: "Meeting request", icon: CalendarClock, tone: "text-brand bg-brand-50" },
  quote: { label: "Quotation requests", short: "Quotation request", icon: Calculator, tone: "text-[#1d6b45] bg-[#e7f5ee]" },
};

const VIEWS: { id: View; label: string; icon: typeof Inbox }[] = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "unread", label: "Unread", icon: Mail },
  { id: "starred", label: "Starred", icon: Star },
  { id: "careers", label: KIND.careers.label, icon: KIND.careers.icon },
  { id: "meeting", label: KIND.meeting.label, icon: KIND.meeting.icon },
  { id: "quote", label: KIND.quote.label, icon: KIND.quote.icon },
  { id: "archived", label: "Archived", icon: Archive },
];

const inView = (s: Submission, v: View) => {
  if (v === "archived") return s.archived;
  if (s.archived) return false;
  if (v === "inbox") return true;
  if (v === "unread") return !s.read;
  if (v === "starred") return s.starred;
  return s.kind === v;
};

const kb = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const ref = (id: string) => `QSGS-${id.slice(-8).toUpperCase()}`;

function shortDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  if (now.getTime() - d.getTime() < 6 * 86400_000) return d.toLocaleDateString(undefined, { weekday: "short" });
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: d.getFullYear() === now.getFullYear() ? undefined : "numeric" });
}
const longDate = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" });

type Status = { mail: string | null; storage: boolean };

/** Submissions dashboard: inbox list, detail panel and actions (read, star, archive, note, delete, export). */
export function Dashboard({ initialItems, openId, email, status }: { initialItems: Submission[]; openId?: string; email: string; status: Status }) {
  const [items, setItems] = useState(initialItems);
  const [view, setView] = useState<View>("inbox");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(openId && initialItems.some((s) => s.id === openId) ? openId : null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ ids: string[] } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const router = useRouter();
  const handle401 = useCallback(
    (res: Response) => {
      if (res.status === 401) router.replace("/admin/login/");
    },
    [router],
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/submissions/", { cache: "no-store" });
      handle401(res);
      const json = (await res.json()) as { ok: boolean; items: Submission[] };
      if (json.ok) setItems(json.items);
    } finally {
      setRefreshing(false);
    }
  }, [handle401]);

  // Refresh when the tab regains focus, and every 2 minutes while open.
  useEffect(() => {
    const onFocus = () => document.visibilityState === "visible" && refresh();
    document.addEventListener("visibilitychange", onFocus);
    const t = setInterval(onFocus, 120_000);
    return () => {
      document.removeEventListener("visibilitychange", onFocus);
      clearInterval(t);
    };
  }, [refresh]);

  const counts = useMemo(() => Object.fromEntries(VIEWS.map((v) => [v.id, items.filter((s) => inView(s, v.id) && (v.id === "archived" || v.id === "starred" || !s.read)).length])) as Record<View, number>, [items]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((s) => inView(s, view) && (!q || [s.name, s.email, s.company, s.country, s.summary, s.message, s.phone, ref(s.id)].some((x) => x?.toLowerCase().includes(q))));
  }, [items, view, query]);

  const current = items.find((s) => s.id === selected) ?? null;

  const [weekStart] = useState(() => Date.now() - 7 * 86400_000);
  const stats = useMemo(() => {
    const week = weekStart;
    return {
      week: items.filter((s) => new Date(s.createdAt).getTime() > week).length,
      unread: items.filter((s) => !s.read && !s.archived).length,
      careers: items.filter((s) => s.kind === "careers").length,
      meeting: items.filter((s) => s.kind === "meeting").length,
      quote: items.filter((s) => s.kind === "quote").length,
    };
  }, [items, weekStart]);

  async function patch(id: string, body: Partial<Pick<Submission, "read" | "starred" | "archived" | "note">>, message?: string) {
    setItems((all) => all.map((s) => (s.id === id ? { ...s, ...body } : s)));
    const res = await fetch(`/api/admin/submissions/${id}/`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    handle401(res);
    if (!res.ok) {
      notify("Could not save. Please try again.");
      refresh();
    } else if (message) notify(message);
  }

  async function bulk(action: string, ids: string[]) {
    if (!ids.length) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/submissions/bulk/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids, action }) });
      handle401(res);
      if (!res.ok) throw new Error();
      const n = ids.length;
      const label = { read: "marked as read", unread: "marked as unread", archive: "archived", unarchive: "moved to inbox", delete: "deleted", star: "starred", unstar: "unstarred" }[action];
      notify(`${n} item${n === 1 ? "" : "s"} ${label}.`);
      if (action === "delete" && selected && ids.includes(selected)) setSelected(null);
      setChecked(new Set());
      await refresh();
    } catch {
      notify("Action failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function open(s: Submission) {
    setSelected(s.id);
    if (!s.read) patch(s.id, { read: true });
  }

  async function logout() {
    await fetch("/api/admin/logout/", { method: "POST" });
    router.replace("/admin/login/");
  }

  const allChecked = list.length > 0 && list.every((s) => checked.has(s.id));
  const viewLabel = VIEWS.find((v) => v.id === view)!.label;

  return (
    <div className="flex h-dvh flex-col lg:flex-row">
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden w-[248px] shrink-0 flex-col border-r border-line bg-white lg:flex">
        <div className="px-5 py-5">
          <Logo className="h-8 w-auto text-brand" />
          <p className="t-xs mt-2 text-muted">Submissions dashboard</p>
        </div>
        <nav aria-label="Folders" className="flex-1 overflow-y-auto px-3">
          {VIEWS.map((v, i) => (
            <div key={v.id}>
              {(i === 3 || i === 6) && <div className="mx-2 my-2 h-px bg-line" />}
              <button
                type="button"
                onClick={() => {
                  setView(v.id);
                  setChecked(new Set());
                }}
                aria-current={view === v.id ? "page" : undefined}
                className={cn(
                  "t-small flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition-colors",
                  view === v.id ? "bg-brand-50 font-medium text-brand" : "text-ink-2 hover:bg-paper-2",
                )}
              >
                <v.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{v.label}</span>
                {counts[v.id] > 0 && <span className={cn("t-xs tabular-nums", view === v.id ? "text-brand" : "text-muted")}>{counts[v.id]}</span>}
              </button>
            </div>
          ))}
        </nav>
        <div className="border-t border-line p-3">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- CSV file download from a route handler, not a page */}
          <a href="/api/admin/export/" className="t-small flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-ink-2 hover:bg-paper-2">
            <Download className="h-4 w-4" /> Export CSV
          </a>
          <a href="/" target="_blank" rel="noreferrer" className="t-small flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-ink-2 hover:bg-paper-2">
            <ExternalLink className="h-4 w-4" /> View website
          </a>
          <div className="mt-2 flex items-center gap-2 rounded-[10px] bg-paper-2 px-3 py-2.5">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-[12px] font-semibold text-white">{email[0]?.toUpperCase()}</span>
            <span className="t-xs min-w-0 flex-1 truncate text-ink-2">{email}</span>
            <button type="button" onClick={logout} aria-label="Sign out" title="Sign out" className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-white hover:text-ink">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Top bar (mobile/tablet) ── */}
      <header className="border-b border-line bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo className="h-7 w-auto text-brand" />
          <div className="flex items-center gap-1">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- CSV file download from a route handler, not a page */}
            <a href="/api/admin/export/" aria-label="Export CSV" className="grid h-10 w-10 place-items-center rounded-full text-ink-2 hover:bg-paper-2">
              <Download className="h-5 w-5" />
            </a>
            <button type="button" onClick={logout} aria-label="Sign out" className="grid h-10 w-10 place-items-center rounded-full text-ink-2 hover:bg-paper-2">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
        <nav aria-label="Folders" className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                setView(v.id);
                setChecked(new Set());
              }}
              className={cn(
                "t-small flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2",
                view === v.id ? "bg-brand text-white" : "bg-paper-2 text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)]",
              )}
            >
              {v.label}
              {counts[v.id] > 0 && <span className={cn("t-xs tabular-nums", view === v.id ? "text-white/80" : "text-muted")}>{counts[v.id]}</span>}
            </button>
          ))}
        </nav>
      </header>

      {/* ── List ── */}
      <section aria-label={viewLabel} className={cn("flex min-h-0 flex-1 flex-col bg-paper-2 lg:max-w-[460px] lg:border-r lg:border-line xl:max-w-[520px]", current && "hidden md:flex")}>
        <div className="space-y-3 px-4 pb-3 pt-4 sm:px-5 lg:pt-5">
          <div className="flex items-center justify-between gap-3">
            <h1 className="t-h3">
              {viewLabel} <span className="t-small font-normal text-muted">{list.length}</span>
            </h1>
            <button type="button" onClick={refresh} aria-label="Refresh" className="grid h-9 w-9 place-items-center rounded-full text-ink-2 hover:bg-white">
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            </button>
          </div>
          <label className="relative block">
            <span className="sr-only">Search submissions</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, company, reference…"
              className="t-small w-full rounded-full bg-white py-2.5 pl-10 pr-4 shadow-[inset_0_0_0_1px_var(--color-line)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--color-brand)]"
            />
          </label>
          {view === "inbox" && !query && (
            <dl className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {(
                [
                  ["This week", stats.week],
                  ["Unread", stats.unread],
                  ["CVs", stats.careers],
                  ["Meetings", stats.meeting],
                  ["Quotes", stats.quote],
                ] as const
              ).map(([k, v], i) => (
                <div key={k} className={cn("rounded-[12px] bg-white px-3 py-2.5 shadow-[inset_0_0_0_1px_var(--color-line)]", i > 2 && "hidden sm:block")}>
                  <dt className="t-xs text-muted">{k}</dt>
                  <dd className="t-h4 mt-0.5 tabular-nums text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {!status.mail && (
            <p className="t-xs flex items-start gap-2 rounded-[12px] bg-[#fff4e0] px-3 py-2.5 text-[#7a4b00]">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> Email is not connected yet. New submissions are saved here, but no emails are sent. See the Microsoft 365 setup steps.
            </p>
          )}
          {!status.storage && (
            <p className="t-xs flex items-start gap-2 rounded-[12px] bg-[#fdecea] px-3 py-2.5 text-[#a3301f]">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> The storage bucket is not connected, so submissions cannot be saved.
            </p>
          )}
        </div>

        {/* Bulk actions */}
        <div className="flex min-h-[48px] items-center gap-2 border-y border-line bg-white px-4 sm:px-5">
          <input
            type="checkbox"
            aria-label="Select all"
            checked={allChecked}
            onChange={() => setChecked(allChecked ? new Set() : new Set(list.map((s) => s.id)))}
            className="h-4 w-4 accent-[#046492]"
          />
          {checked.size > 0 ? (
            <div className="flex flex-1 flex-wrap items-center gap-1">
              <span className="t-xs mr-2 text-muted">{checked.size} selected</span>
              <BulkBtn disabled={busy} onClick={() => bulk("read", [...checked])} icon={MailOpen} label="Read" />
              <BulkBtn disabled={busy} onClick={() => bulk("unread", [...checked])} icon={Mail} label="Unread" />
              {view === "archived" ? (
                <BulkBtn disabled={busy} onClick={() => bulk("unarchive", [...checked])} icon={ArchiveRestore} label="Restore" />
              ) : (
                <BulkBtn disabled={busy} onClick={() => bulk("archive", [...checked])} icon={Archive} label="Archive" />
              )}
              <BulkBtn disabled={busy} onClick={() => setConfirm({ ids: [...checked] })} icon={Trash2} label="Delete" danger />
            </div>
          ) : (
            <span className="t-xs text-muted">Select items for bulk actions</span>
          )}
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto">
          {list.map((s) => {
            const K = KIND[s.kind];
            return (
              <li key={s.id} className={cn("relative border-b border-line", selected === s.id ? "bg-brand-50" : s.read ? "bg-paper-2" : "bg-white")}>
                <div className="flex gap-3 px-4 py-3.5 sm:px-5">
                  <input
                    type="checkbox"
                    aria-label={`Select ${s.name}`}
                    checked={checked.has(s.id)}
                    onChange={() =>
                      setChecked((c) => {
                        const n = new Set(c);
                        if (n.has(s.id)) n.delete(s.id);
                        else n.add(s.id);
                        return n;
                      })
                    }
                    className="relative z-10 mt-1 h-4 w-4 shrink-0 accent-[#046492]"
                  />
                  <button type="button" onClick={() => open(s)} className="min-w-0 flex-1 text-left after:absolute after:inset-0">
                    <span className="flex items-center gap-2">
                      {!s.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />}
                      <span className={cn("t-small min-w-0 flex-1 truncate", s.read ? "text-ink-2" : "font-semibold text-ink")}>{s.name}</span>
                      <span className="t-xs shrink-0 tabular-nums text-muted" suppressHydrationWarning>
                        {shortDate(s.createdAt)}
                      </span>
                    </span>
                    <span className="mt-1 flex items-center gap-2">
                      <span className={cn("t-xs inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-medium", K.tone)}>
                        <K.icon className="h-3 w-3" /> {K.short}
                      </span>
                      {s.company && <span className="t-xs truncate text-muted">{s.company}</span>}
                    </span>
                    <span className="t-xs mt-1.5 line-clamp-1 text-muted">{s.summary}</span>
                  </button>
                  <div className="relative z-10 flex flex-col items-end gap-2">
                    <button type="button" onClick={() => patch(s.id, { starred: !s.starred })} aria-label={s.starred ? "Unstar" : "Star"} className="text-muted hover:text-[#d79a00]">
                      <Star className={cn("h-4 w-4", s.starred && "fill-[#f2b705] text-[#d79a00]")} />
                    </button>
                    {s.files.length > 0 && (
                      <span className="t-xs flex items-center gap-0.5 text-muted" aria-label={`${s.files.length} files`}>
                        <Paperclip className="h-3.5 w-3.5" />
                        {s.files.length}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
          {!list.length && (
            <li className="px-6 py-16 text-center">
              <Inbox className="mx-auto h-10 w-10 text-line" strokeWidth={1.4} />
              <p className="t-h4 mt-4 text-ink">{query ? "No matches" : "Nothing here yet"}</p>
              <p className="t-small mt-1 text-muted">{query ? "Try another name, email or reference." : "New CVs, meeting requests and quotation requests appear here."}</p>
            </li>
          )}
        </ul>
      </section>

      {/* ── Detail ── */}
      <section aria-label="Submission details" className={cn("min-h-0 flex-1 overflow-y-auto bg-white", !current && "hidden md:block")}>
        {current ? (
          <Detail
            key={current.id}
            s={current}
            onBack={() => setSelected(null)}
            onPatch={(b, m) => patch(current.id, b, m)}
            onDelete={() => setConfirm({ ids: [current.id] })}
          />
        ) : (
          <div className="grid h-full place-items-center p-10 text-center">
            <div>
              <MailOpen className="mx-auto h-12 w-12 text-line" strokeWidth={1.3} />
              <p className="t-h4 mt-4 text-ink">Select a submission</p>
              <p className="t-small mt-1 text-muted">Its details, files and actions open here.</p>
            </div>
          </div>
        )}
      </section>

      {/* ── Delete confirmation ── */}
      {confirm && (
        <div role="dialog" aria-modal="true" aria-labelledby="del-title" className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={() => setConfirm(null)}>
          <div className="w-full max-w-[420px] rounded-[18px] bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#fdecea] text-[#c0392b]">
              <Trash2 className="h-5 w-5" />
            </span>
            <h2 id="del-title" className="t-h3 mt-4">
              Delete {confirm.ids.length === 1 ? "this submission" : `${confirm.ids.length} submissions`}?
            </h2>
            <p className="t-small mt-2 text-muted">The record and all of its uploaded files are removed from storage permanently. This cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirm(null)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  const ids = confirm.ids;
                  setConfirm(null);
                  await bulk("delete", ids);
                }}
                className="btn btn-sm bg-[#c0392b] text-white hover:bg-[#a3301f]"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className="t-small fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-white shadow-lg">
          <Check className="h-4 w-4" /> {toast}
        </div>
      )}
    </div>
  );
}

function BulkBtn({ onClick, icon: Icon, label, danger, disabled }: { onClick: () => void; icon: typeof Mail; label: string; danger?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn("t-xs inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-medium disabled:opacity-50", danger ? "text-[#c0392b] hover:bg-[#fdecea]" : "text-ink-2 hover:bg-paper-2")}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function Detail({
  s,
  onBack,
  onPatch,
  onDelete,
}: {
  s: Submission;
  onBack: () => void;
  onPatch: (b: Partial<Pick<Submission, "read" | "starred" | "archived" | "note">>, message?: string) => void;
  onDelete: () => void;
}) {
  const K = KIND[s.kind];
  const [note, setNote] = useState(s.note);
  const dirty = note !== s.note;
  const replySubject = encodeURIComponent(`Re: your ${K.short.toLowerCase()} (${ref(s.id)})`);
  const base: [string, string][] = [
    ["Email", s.email],
    ["Phone", s.phone ?? ""],
    ["Company", s.company ?? ""],
    ["Country", s.country ?? ""],
  ];
  const rows = [...base, ...s.fields].filter(([, v]) => v);

  return (
    <article className="mx-auto max-w-[820px] px-4 pb-16 pt-4 sm:px-8 sm:pt-7">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 -mx-4 flex items-center gap-1 border-b border-line bg-white/95 px-4 py-2 backdrop-blur sm:-mx-8 sm:px-8">
        <button type="button" onClick={onBack} aria-label="Back to list" className="grid h-10 w-10 place-items-center rounded-full text-ink-2 hover:bg-paper-2 md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <ToolBtn onClick={() => onPatch({ starred: !s.starred }, s.starred ? "Star removed." : "Starred.")} label={s.starred ? "Unstar" : "Star"}>
          <Star className={cn("h-[18px] w-[18px]", s.starred && "fill-[#f2b705] text-[#d79a00]")} />
        </ToolBtn>
        <ToolBtn onClick={() => onPatch({ read: !s.read }, s.read ? "Marked as unread." : "Marked as read.")} label={s.read ? "Mark as unread" : "Mark as read"}>
          {s.read ? <Mail className="h-[18px] w-[18px]" /> : <MailOpen className="h-[18px] w-[18px]" />}
        </ToolBtn>
        <ToolBtn onClick={() => onPatch({ archived: !s.archived }, s.archived ? "Moved to inbox." : "Archived.")} label={s.archived ? "Move to inbox" : "Archive"}>
          {s.archived ? <ArchiveRestore className="h-[18px] w-[18px]" /> : <Archive className="h-[18px] w-[18px]" />}
        </ToolBtn>
        <ToolBtn onClick={onDelete} label="Delete" danger>
          <Trash2 className="h-[18px] w-[18px]" />
        </ToolBtn>
        <a href={`mailto:${s.email}?subject=${replySubject}`} className="btn btn-primary btn-sm ml-auto">
          <Mail className="h-4 w-4" /> Reply
        </a>
      </div>

      <header className="pt-6">
        <span className={cn("t-xs inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium", K.tone)}>
          <K.icon className="h-3.5 w-3.5" /> {K.short}
        </span>
        <h2 className="t-h2 mt-3 break-words">{s.name}</h2>
        <p className="t-small mt-2 text-ink-2">{s.summary}</p>
        <p className="t-xs mt-2 text-muted" suppressHydrationWarning>
          Received {longDate(s.createdAt)} · Ref. {ref(s.id)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={`mailto:${s.email}?subject=${replySubject}`} className="t-small inline-flex items-center gap-2 rounded-full bg-paper-2 px-3.5 py-2 text-ink-2 hover:text-brand">
            <Mail className="h-4 w-4 text-brand" /> {s.email}
          </a>
          {s.phone && (
            <a href={`tel:${s.phone.replace(/[^\d+]/g, "")}`} className="t-small inline-flex items-center gap-2 rounded-full bg-paper-2 px-3.5 py-2 text-ink-2 hover:text-brand">
              <Phone className="h-4 w-4 text-brand" /> {s.phone}
            </a>
          )}
        </div>
      </header>

      <h3 className="eyebrow mt-9">Details</h3>
      <dl className="mt-3 border-t border-ink">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[180px_1fr] sm:gap-6">
            <dt className="t-small text-muted">{k}</dt>
            <dd className="t-small whitespace-pre-line break-words text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      {s.message && (
        <>
          <h3 className="eyebrow mt-9">{s.kind === "careers" ? "Additional information" : s.kind === "quote" ? "Project scope" : "Message"}</h3>
          <p className="t-body mt-3 whitespace-pre-line break-words rounded-[14px] bg-paper-2 px-5 py-4 !text-ink">{s.message}</p>
        </>
      )}

      <h3 className="eyebrow mt-9">Files ({s.files.length})</h3>
      {s.files.length ? (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {s.files.map((f, i) => (
            <li key={f.key} className="flex items-center gap-3 rounded-[14px] px-4 py-3 shadow-[inset_0_0_0_1px_var(--color-line)]">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-brand-50 text-brand">
                <FileText className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <a href={`/api/admin/files/?id=${s.id}&i=${i}`} target="_blank" rel="noreferrer" className="t-small block truncate font-medium text-ink hover:text-brand" title={f.name}>
                  {f.name}
                </a>
                <span className="t-xs text-muted">
                  {f.label} · {kb(f.size)}
                </span>
              </span>
              <a href={`/api/admin/files/?id=${s.id}&i=${i}&download=1`} aria-label={`Download ${f.name}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-2 hover:bg-paper-2 hover:text-brand">
                <Download className="h-4 w-4" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="t-small mt-3 text-muted">No files were attached.</p>
      )}

      <h3 className="eyebrow mt-9">Internal note</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Only you can see this — e.g. called on Monday, quotation sent…"
        className="field mt-3 min-h-[110px] bg-white"
      />
      <div className="mt-2 flex items-center justify-end gap-2">
        {dirty && (
          <button type="button" onClick={() => setNote(s.note)} className="btn btn-outline btn-sm">
            Cancel
          </button>
        )}
        <button type="button" disabled={!dirty} onClick={() => onPatch({ note }, "Note saved.")} className="btn btn-primary btn-sm disabled:opacity-40">
          Save note
        </button>
      </div>

      <h3 className="eyebrow mt-9">Email delivery</h3>
      <ul className="t-small mt-3 space-y-1.5 text-ink-2">
        <li className="flex items-center gap-2">
          {s.mail.notified ? <Check className="h-4 w-4 text-[#1d6b45]" /> : <X className="h-4 w-4 text-[#c0392b]" />} Notification to your inbox {s.mail.notified ? "sent" : "not sent"}
        </li>
        <li className="flex items-center gap-2">
          {s.mail.confirmed ? <Check className="h-4 w-4 text-[#1d6b45]" /> : <X className="h-4 w-4 text-[#c0392b]" />} Confirmation to {s.name.split(" ")[0]} {s.mail.confirmed ? "sent" : "not sent"}
        </li>
        {s.mail.error && <li className="t-xs text-muted">Reason: {s.mail.error}</li>}
      </ul>
    </article>
  );
}

function ToolBtn({ onClick, label, danger, children }: { onClick: () => void; label: string; danger?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={cn("grid h-10 w-10 place-items-center rounded-full text-ink-2", danger ? "hover:bg-[#fdecea] hover:text-[#c0392b]" : "hover:bg-paper-2 hover:text-ink")}>
      {children}
    </button>
  );
}
