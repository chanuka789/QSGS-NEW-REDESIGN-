"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, FileText, UploadCloud, X } from "lucide-react";
import { CountryOptions, Field, FormError, Honeypot, SubmitButton, Success } from "./FormBits";
import { countries, priorityCountries } from "@/lib/countries";
import { FILE_RULES, JOB_TYPES } from "@/lib/form-rules";
import { routes } from "@/lib/site";
import { cn } from "@/lib/utils";

const fmt = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

function DropZone({ id, label, required, files, setFiles, error }: { id: string; label: string; required?: boolean; files: File[]; setFiles: (f: File[]) => void; error?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [local, setLocal] = useState<string>();

  const add = (list: FileList | null) => {
    if (!list) return;
    const next = [...files];
    for (const f of Array.from(list)) {
      const ext = f.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] ?? "";
      if (!(FILE_RULES.extensions as readonly string[]).includes(ext)) return setLocal(`${f.name}: please use PDF or Word files.`);
      if (f.size > FILE_RULES.maxFileBytes) return setLocal(`${f.name} is larger than 5 MB.`);
      if (next.length >= FILE_RULES.maxFiles) return setLocal(`You can upload up to ${FILE_RULES.maxFiles} files.`);
      if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
    }
    setLocal(undefined);
    setFiles(next);
  };

  return (
    <Field id={id} label={label} required={required} error={error || local}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-[14px] border border-dashed px-5 py-7 text-center transition-colors",
          drag ? "border-brand bg-brand/5" : "border-ink/25 bg-white/50 hover:border-ink/50",
          (error || local) && "border-[#c0392b]",
        )}
      >
        <UploadCloud className="mx-auto h-7 w-7 text-brand" strokeWidth={1.5} aria-hidden />
        <p className="mt-3 text-[0.95rem] text-ink">
          Drag files here or{" "}
          <button type="button" onClick={() => input.current?.click()} className="font-medium text-brand underline underline-offset-4">
            browse
          </button>
        </p>
        <p className="mt-1 text-[0.8rem] text-muted">PDF, DOC or DOCX · up to 4 files · 5 MB each</p>
        <input
          ref={input}
          id={id}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {files.length > 0 && (
        <ul className="mt-3 grid gap-2">
          {files.map((f, i) => (
            <li key={f.name + i} className="flex items-center gap-3 rounded-[12px] bg-white/70 px-4 py-2.5 text-[0.9rem] shadow-[inset_0_0_0_1px_rgb(16_36_46/0.08)]">
              <FileText className="h-4 w-4 shrink-0 text-brand" aria-hidden />
              <span className="min-w-0 flex-1 truncate">{f.name}</span>
              <span className="text-[0.8rem] text-muted">{fmt(f.size)}</span>
              <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles(files.filter((_, k) => k !== i))} className="grid h-7 w-7 place-items-center rounded-full hover:bg-ink/5">
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Field>
  );
}

export function CareersForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [resume, setResume] = useState<File[]>([]);
  const [cover, setCover] = useState<File[]>([]);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, [done]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const local: Record<string, string> = {};
    if (!String(fd.get("firstName") || "").trim()) local.firstName = "Please enter your first name.";
    if (!String(fd.get("lastName") || "").trim()) local.lastName = "Please enter your last name.";
    if (!/^\S+@\S+\.\S+$/.test(String(fd.get("email") || ""))) local.email = "Please enter a valid email address.";
    if (String(fd.get("phone") || "").trim().length < 6) local.phone = "Please enter your phone number.";
    if (!fd.get("jobType")) local.jobType = "Please choose a job type.";
    if (!resume.length) local.resume = "Please upload your resume (PDF or Word).";
    if (!fd.get("consent")) local.consent = "Please agree so we can process your application.";
    setErrors(local);
    setFormError(undefined);
    if (Object.keys(local).length) {
      document.getElementById(Object.keys(local)[0] === "jobType" ? "jobType-0" : Object.keys(local)[0])?.focus();
      return;
    }
    resume.forEach((f) => fd.append("resume", f));
    cover.forEach((f) => fd.append("coverLetter", f));
    fd.set("consent", "true");
    fd.set("startedAt", String(startedAt.current));
    setLoading(true);
    try {
      const res = await fetch("/api/careers/", { method: "POST", body: fd });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, string> };
      if (!res.ok || !json.ok) {
        setErrors(json.fields ?? {});
        setFormError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
      setResume([]);
      setCover([]);
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) return <Success title="Application sent." text="Thank you for applying. We will review your CV and contact you if your profile matches our needs." onReset={() => setDone(false)} />;

  const err = (k: string) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-error` } : {});

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-6 sm:grid-cols-2">
      <Honeypot />
      <Field id="firstName" label="First name" required error={errors.firstName}>
        <input id="firstName" name="firstName" autoComplete="given-name" className="field" {...err("firstName")} />
      </Field>
      <Field id="lastName" label="Last name" required error={errors.lastName}>
        <input id="lastName" name="lastName" autoComplete="family-name" className="field" {...err("lastName")} />
      </Field>
      <Field id="email" label="Email" required error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" inputMode="email" className="field" {...err("email")} />
      </Field>
      <Field id="phone" label="Phone" required error={errors.phone}>
        <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" className="field" {...err("phone")} />
      </Field>
      <Field id="address1" label="Address line 1" className="sm:col-span-2">
        <input id="address1" name="address1" autoComplete="address-line1" className="field" />
      </Field>
      <Field id="city" label="City">
        <input id="city" name="city" autoComplete="address-level2" className="field" />
      </Field>
      <Field id="state" label="State / Province / Region">
        <input id="state" name="state" autoComplete="address-level1" className="field" />
      </Field>
      <Field id="country" label="Country" className="sm:col-span-2">
        <select id="country" name="country" autoComplete="country-name" className="field" defaultValue="">
          <CountryOptions countries={countries} priority={priorityCountries} />
        </select>
      </Field>

      <fieldset className="sm:col-span-2">
        <legend className="mb-3 text-[0.88rem] font-medium text-ink">
          Job type <span className="text-brand" aria-hidden>*</span>
        </legend>
        <div className="flex flex-wrap gap-2" role="radiogroup">
          {JOB_TYPES.map((t, i) => (
            <label key={t} className="cursor-pointer">
              <input id={`jobType-${i}`} type="radio" name="jobType" value={t} className="peer sr-only" />
              <span className="tab peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-brand">{t}</span>
            </label>
          ))}
        </div>
        {errors.jobType && <p role="alert" className="mt-1.5 text-[0.82rem] text-[#c0392b]">{errors.jobType}</p>}
      </fieldset>

      <DropZone id="resume" label="Upload your resume" required files={resume} setFiles={setResume} error={errors.resume} />
      <DropZone id="coverLetter" label="Upload your cover letter" files={cover} setFiles={setCover} error={errors.coverLetter} />

      <Field id="info" label="Additional information" className="sm:col-span-2">
        <textarea id="info" name="info" className="field" placeholder="Experience, software skills, notice period, portfolio links…" />
      </Field>

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-[0.9rem] leading-relaxed text-muted">
          <input id="consent" name="consent" type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#046492]" {...err("consent")} />
          <span>
            I agree that my application and documents may be stored and reviewed for recruitment, as described in the{" "}
            <Link href={routes.privacy} className="text-ink underline underline-offset-4">privacy policy</Link>.
          </span>
        </label>
        {errors.consent && <p id="consent-error" role="alert" className="mt-1.5 text-[0.82rem] text-[#c0392b]">{errors.consent}</p>}
      </div>

      <div className="grid gap-4 sm:col-span-2">
        <FormError message={formError} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.82rem] text-muted">
            Fields marked <span className="text-brand">*</span> are required.
          </p>
          <SubmitButton loading={loading}>
            Submit application <ArrowUpRight className="h-5 w-5" />
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
