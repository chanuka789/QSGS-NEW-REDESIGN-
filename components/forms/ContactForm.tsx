"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CountryOptions, Field, FormError, Honeypot, SubmitButton, Success } from "./FormBits";
import { countries, priorityCountries } from "@/lib/countries";
import { companyTypes, routes } from "@/lib/site";
import { modules } from "@/lib/services";

const services = Object.values(modules).map((m) => m.title);

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const startedAt = useRef(0);
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    if (dateRef.current) dateRef.current.min = new Date().toISOString().slice(0, 10);
  }, [done]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const local: Record<string, string> = {};
    if (!data.name || data.name.trim().length < 2) local.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(data.email || "")) local.email = "Please enter a valid email address.";
    if (!data.country) local.country = "Please select your country.";
    if (!fd.get("consent")) local.consent = "Please agree so we can reply to your request.";
    setErrors(local);
    setFormError(undefined);
    if (Object.keys(local).length) {
      document.getElementById(Object.keys(local)[0])?.focus();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          consent: true,
          startedAt: startedAt.current,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, string> };
      if (!res.ok || !json.ok) {
        setErrors(json.fields ?? {});
        setFormError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) return <Success title="Request sent." text="Thank you. Our team will contact you shortly to confirm your online meeting. A confirmation has been sent to your email." onReset={() => setDone(false)} />;

  const err = (k: string) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-error` } : {});

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-6 sm:grid-cols-2" aria-describedby="form-note">
      <Honeypot />
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
      <Field id="message" label="Comment or message" className="sm:col-span-2">
        <textarea id="message" name="message" className="field" placeholder="Tell us about your project, drawings and deadline." />
      </Field>
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
            Schedule meeting <ArrowUpRight className="h-5 w-5" />
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
