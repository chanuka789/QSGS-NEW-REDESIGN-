"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CountryOptions, Field, FormError, Honeypot, SubmitButton, Success } from "./FormBits";
import { DropZone } from "./DropZone";
import { HumanCheck, type HumanCheckHandle } from "./HumanCheck";
import { cn } from "@/lib/utils";
import { countries, priorityCountries } from "@/lib/countries";
import { companyTypes, projectTypes, routes } from "@/lib/site";
import { modules } from "@/lib/services";

const services = [...Object.values(modules).map((m) => m.title), "Cost plans & estimates", "BOQ certification for bank loans"];

type RequestType = "meeting" | "quote";

/** "Get a quote" links open the form with ?type=quote. */
function WithParams() {
  const initial: RequestType = useSearchParams().get("type") === "quote" ? "quote" : "meeting";
  return <Form key={initial} initial={initial} />;
}

/** Contact page form: online meeting requests and quotation requests share one form. */
export function ContactForm() {
  return (
    <Suspense fallback={<Form initial="meeting" />}>
      <WithParams />
    </Suspense>
  );
}

function Form({ initial }: { initial: RequestType }) {
  const [type, setType] = useState<RequestType>(initial);
  const human = useRef<HumanCheckHandle>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const startedAt = useRef(0);
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    if (dateRef.current) dateRef.current.min = new Date().toISOString().slice(0, 10);
  }, [done, type]);


  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const local: Record<string, string> = {};
    if (!data.name || data.name.trim().length < 2) local.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(data.email || "")) local.email = "Please enter a valid email address.";
    if (!data.country) local.country = "Please select your country.";
    if (type === "quote" && !data.projectType) local.projectType = "Please choose the project type.";
    if (type === "quote" && (data.message || "").trim().length < 10) local.message = "Please describe the scope (at least a sentence).";
    if (!fd.get("consent")) local.consent = "Please agree so we can reply to your request.";
    setErrors(local);
    setFormError(undefined);
    if (Object.keys(local).length) {
      document.getElementById(Object.keys(local)[0])?.focus();
      return;
    }
    setLoading(true);
    const captcha = await human.current?.start();
    if (!captcha) {
      setLoading(false);
      setErrors({ captcha: "Please verify that you are human." });
      return;
    }
    try {
      const body = new FormData();
      Object.entries(data).forEach(([k, v]) => body.set(k, v));
      body.set("consent", "true");
      body.set("requestType", type);
      body.set("captcha", captcha);
      body.set("startedAt", String(startedAt.current));
      body.set("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
      files.forEach((f) => body.append("attachments", f));
      const res = await fetch("/api/contact/", { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, string> };
      if (!res.ok || !json.ok) {
        setErrors(json.fields ?? {});
        setFormError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
      setFiles([]);
      human.current?.reset();
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done)
    return (
      <Success
        title={type === "quote" ? "Quotation request sent." : "Request sent."}
        text={
          type === "quote"
            ? "Thank you. A quantity surveyor will review your scope and send you a quotation. A confirmation with your reference number has been sent to your email."
            : "Thank you. Our team will contact you shortly to confirm your online meeting. A confirmation with your reference number has been sent to your email."
        }
        onReset={() => setDone(false)}
      />
    );

  const err = (k: string) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-error` } : {});

  return (
    <form method="post" action="/api/contact/" encType="multipart/form-data" onSubmit={onSubmit} onFocus={() => human.current?.start()} noValidate className="relative grid gap-6 sm:grid-cols-2" aria-describedby="form-note">
      <Honeypot />
      <div role="radiogroup" aria-label="What do you need?" className="grid grid-cols-2 gap-1 rounded-full bg-paper-2 p-1 shadow-[inset_0_0_0_1px_var(--color-line)] sm:col-span-2">
        {(
          [
            ["meeting", "Schedule a meeting"],
            ["quote", "Request a quotation"],
          ] as const
        ).map(([v, label]) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={type === v}
            onClick={() => {
              setType(v);
              setErrors({});
            }}
            className={cn("t-small rounded-full px-4 py-2.5 font-medium transition-colors", type === v ? "bg-white text-brand shadow-[0_1px_3px_rgb(17_28_36/0.12)]" : "text-ink-2 hover:text-ink")}
          >
            {label}
          </button>
        ))}
      </div>
      <Field id="name" label="Name" required error={errors.name}>
        <input id="name" name="name" autoComplete="name" className="field" {...err("name")} />
      </Field>
      <Field id="email" label="Email" required error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" inputMode="email" className="field" {...err("email")} />
      </Field>
      <Field id="company" label="Company name" error={errors.company}>
        <input id="company" name="company" autoComplete="organization" className="field" />
      </Field>
      <Field id="companyType" label="Company type" error={errors.companyType}>
        <select id="companyType" name="companyType" className="field" defaultValue="">
          <option value="">Select type</option>
          {companyTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>
      <Field id="country" label="Country" required error={errors.country}>
        <select id="country" name="country" autoComplete="country-name" className="field" defaultValue="" {...err("country")}>
          <CountryOptions countries={countries} priority={priorityCountries} />
        </select>
      </Field>
      <Field id="phone" label="Phone" error={errors.phone}>
        <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" className="field" />
      </Field>
      {type === "quote" ? (
        <>
          <Field id="projectName" label="Project name" error={errors.projectName}>
            <input id="projectName" name="projectName" className="field" placeholder="e.g. Marina Residences, Tower B" />
          </Field>
          <Field id="projectType" label="Project type" required error={errors.projectType}>
            <select id="projectType" name="projectType" className="field" defaultValue="" {...err("projectType")}>
              <option value="">Select type</option>
              {projectTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field id="projectLocation" label="Project location" error={errors.projectLocation}>
            <input id="projectLocation" name="projectLocation" className="field" placeholder="City, country" />
          </Field>
          <Field id="deadline" label="Required by" error={errors.deadline}>
            <input ref={dateRef} id="deadline" name="deadline" type="date" className="field" />
          </Field>
          <Field id="service" label="Service required" className="sm:col-span-2">
            <select id="service" name="service" className="field" defaultValue="">
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </>
      ) : (
        <>
          <Field id="service" label="Service of interest" className="sm:col-span-2">
            <select id="service" name="service" className="field" defaultValue="">
              <option value="">Select a service (optional)</option>
              {services.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field id="date" label="Preferred meeting date" error={errors.date}>
            <input ref={dateRef} id="date" name="date" type="date" className="field" />
          </Field>
          <Field id="time" label="Preferred time" hint="Your local time zone is included automatically." error={errors.time}>
            <input id="time" name="time" type="time" className="field" />
          </Field>
        </>
      )}
      <div className="sm:col-span-2">
        <DropZone id="attachments" label={type === "quote" ? "Drawings, specifications or BoQ format (recommended)" : "Attach drawings or documents (optional)"} files={files} setFiles={setFiles} error={errors.attachments} />
      </div>
      <Field id="message" label={type === "quote" ? "Project scope and requirements" : "Comment or message"} required={type === "quote"} error={errors.message} className="sm:col-span-2">
        <textarea
          id="message"
          name="message"
          className="field"
          placeholder={type === "quote" ? "Which disciplines, measurement standard (NRM, POMI, SMM7…), BoQ format and deliverables do you need?" : "Tell us about your project, drawings and deadline."}
          {...err("message")}
        />
      </Field>
      <div className="sm:col-span-2">
        <HumanCheck ref={human} error={errors.captcha} />
      </div>
      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 t-small leading-relaxed text-muted">
          <input id="consent" name="consent" type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#046492]" {...err("consent")} />
          <span>
            I agree that Quantity Surveying Global Solutions may use these details to respond to my request, as described in the{" "}
            <Link href={routes.privacy} className="text-ink underline underline-offset-4">privacy policy</Link>.
          </span>
        </label>
        {errors.consent && <p id="consent-error" role="alert" className="mt-1.5 t-xs text-[#c0392b]">{errors.consent}</p>}
      </div>
      <div className="grid gap-4 sm:col-span-2">
        <FormError message={formError} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p id="form-note" className="t-xs text-muted">Fields marked <span className="text-brand">*</span> are required.</p>
          <SubmitButton loading={loading}>
            {type === "quote" ? "Request quotation" : "Schedule meeting"} <ArrowUpRight className="h-5 w-5" />
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
