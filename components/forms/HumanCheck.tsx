"use client";

import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type State = "idle" | "working" | "done" | "error";
export type HumanCheckHandle = { start: () => Promise<string | null>; reset: () => void };

const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");

/** Finds n where sha256(salt + n) === challenge, hashing in parallel batches so the page stays responsive. */
async function solve(salt: string, challenge: string, max: number) {
  const enc = new TextEncoder();
  const BATCH = 400;
  for (let start = 0; start <= max; start += BATCH) {
    const nums = Array.from({ length: Math.min(BATCH, max - start + 1) }, (_, i) => start + i);
    const hashes = await Promise.all(nums.map((n) => crypto.subtle.digest("SHA-256", enc.encode(salt + n))));
    const hit = hashes.findIndex((h) => hex(h) === challenge);
    if (hit >= 0) return nums[hit];
  }
  return null;
}

/**
 * "I'm human" check: a small proof-of-work puzzle solved in the browser (no tracking,
 * no third-party service). It starts by itself when the visitor begins filling in the
 * form, or when the box is clicked. The solution is posted in the hidden `captcha` field.
 */
export const HumanCheck = forwardRef<HumanCheckHandle, { error?: string }>(function HumanCheck({ error }, ref) {
  const [state, setState] = useState<State>("idle");
  const [payload, setPayload] = useState("");
  const pending = useRef<Promise<string | null> | null>(null);

  const start = useCallback(() => {
    if (payload) return Promise.resolve(payload);
    if (pending.current) return pending.current;
    setState("working");
    pending.current = (async () => {
      try {
        const res = await fetch("/api/captcha/", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const c = (await res.json()) as { salt: string; challenge: string; maxnumber: number; signature: string };
        const number = await solve(c.salt, c.challenge, c.maxnumber);
        if (number === null) throw new Error();
        const p = btoa(JSON.stringify({ salt: c.salt, number, challenge: c.challenge, signature: c.signature }));
        setPayload(p);
        setState("done");
        return p;
      } catch {
        setState("error");
        return null;
      } finally {
        pending.current = null;
      }
    })();
    return pending.current;
  }, [payload]);

  useImperativeHandle(ref, () => ({ start, reset: () => { setPayload(""); setState("idle"); } }), [start]);

  const label = { idle: "Verify that you are human", working: "Verifying…", done: "Verified — you are human", error: "Verification failed — tap to try again" }[state];

  return (
    <div>
      <input type="hidden" name="captcha" value={payload} />
      <button
        type="button"
        id="captcha"
        onClick={() => state !== "working" && state !== "done" && start()}
        aria-live="polite"
        aria-describedby={error ? "captcha-error" : undefined}
        className={cn(
          "flex w-full items-center gap-3 rounded-[14px] bg-paper-2 px-4 py-3.5 text-left shadow-[inset_0_0_0_1px_var(--color-line)] transition-shadow sm:w-auto sm:min-w-[320px]",
          error && state !== "done" && "shadow-[inset_0_0_0_1px_#c0392b]",
          state === "done" && "cursor-default",
        )}
      >
        <span
          className={cn(
            "grid h-6 w-6 shrink-0 place-items-center rounded-[7px] bg-white shadow-[inset_0_0_0_1.5px_var(--color-line)] transition-colors",
            state === "done" && "bg-brand text-white shadow-none",
          )}
          aria-hidden
        >
          {state === "working" ? <Loader2 className="h-4 w-4 animate-spin text-brand" /> : state === "done" ? <Check className="h-4 w-4" strokeWidth={3} /> : null}
        </span>
        <span className="t-small flex-1 text-ink">{label}</span>
        <ShieldCheck className="h-5 w-5 text-muted" aria-hidden />
      </button>
      {error && state !== "done" && (
        <p id="captcha-error" role="alert" className="mt-1.5 t-xs text-[#c0392b]">
          {error}
        </p>
      )}
    </div>
  );
});
