"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Field({ id, label, required, error, hint, className, children }: { id: string; label: string; required?: boolean; error?: string; hint?: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={id} className="mb-2 text-[0.88rem] font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-brand" aria-hidden>*</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[0.8rem] text-muted">{hint}</p>}
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-error`} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-[0.82rem] text-[#c0392b]">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Off-screen honeypot. Real users never see or fill it. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="website">Website</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function SubmitButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full justify-between disabled:opacity-70 sm:w-auto sm:justify-center">
      {loading ? (
        <>
          Sending… <Loader2 className="h-5 w-5 animate-spin" />
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function Success({ title, text, onReset }: { title: string; text: string; onReset: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 22 }} className="py-10 text-center" role="status">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 16 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand/10 text-brand">
        <CheckCircle2 className="h-10 w-10" strokeWidth={1.5} />
      </motion.span>
      <h3 className="mt-8 text-[2rem] font-medium">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-muted">{text}</p>
      <button type="button" onClick={onReset} className="link-underline mt-8">
        Send another
      </button>
    </motion.div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-[12px] bg-[#c0392b]/8 px-4 py-3 text-[0.9rem] text-[#a3301f]">
      {message}
    </p>
  );
}

export function CountryOptions({ countries, priority }: { countries: readonly string[]; priority: readonly string[] }) {
  return (
    <>
      <option value="">Select country</option>
      <optgroup label="Our offices & main markets">
        {priority.map((c) => (
          <option key={`p-${c}`} value={c}>{c}</option>
        ))}
      </optgroup>
      <optgroup label="All countries">
        {countries.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </optgroup>
    </>
  );
}
