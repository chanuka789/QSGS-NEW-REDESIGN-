import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { company, offices, routes } from "@/lib/site";
import { segments } from "@/lib/services";
import { BackToTop } from "./BackToTop";

const companyLinks = [
  { label: "Home", href: routes.home },
  { label: "About us", href: routes.about },
  { label: "Our Team", href: routes.team },
  { label: "Our Services", href: routes.services },
  { label: "Careers", href: routes.careers },
  { label: "Contact", href: routes.contact },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative px-5 pb-8 pt-20 sm:px-8 lg:pt-28">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" aria-label={`${company.name} — home`} className="inline-block">
              <Logo className="h-12 w-auto text-brand" />
            </Link>
            <p className="mt-8 max-w-md text-[1.02rem] leading-relaxed text-muted">
              Industry-leading remote quantity surveying — accurate take-offs, BoQ preparation and cost management for projects in 20+ countries.
            </p>
            <a href={`mailto:${company.email}`} className="link-arrow mt-8 text-[1.05rem]">
              {company.email} <ArrowLong />
            </a>
          </div>

          <nav aria-label="Company" className="lg:col-span-2">
            <h2 className="eyebrow !text-[0.72rem] text-muted">Company</h2>
            <ul className="mt-6 space-y-3">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.98rem] text-ink-2 transition-colors hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services" className="lg:col-span-2">
            <h2 className="eyebrow !text-[0.72rem] text-muted">Services for</h2>
            <ul className="mt-6 space-y-3">
              {segments.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-[0.98rem] text-ink-2 transition-colors hover:text-brand">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="eyebrow !text-[0.72rem] text-muted">Offices</h2>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6">
              {offices.map((o) => (
                <li key={o.country} className="text-[0.9rem]">
                  <p className="font-medium text-ink">{o.country}</p>
                  {o.phone && (
                    <a href={o.phoneHref} className="mt-1.5 block text-ink-2 hover:text-brand">
                      {o.phone}
                    </a>
                  )}
                  <a href={`mailto:${o.email}`} className="mt-1 block break-all text-muted hover:text-brand">
                    {o.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pointer-events-none mt-20 select-none overflow-hidden" aria-hidden>
          <p className="whitespace-nowrap text-[10.4vw] font-medium leading-[0.85] tracking-[-0.05em] text-ink/[0.06] xl:text-[8.6rem]">
            QS Global Solutions
          </p>
        </div>

        <div className="rule mt-4" />
        <div className="mt-6 flex flex-col justify-between gap-4 text-[0.85rem] text-muted sm:flex-row sm:items-center">
          <p>© {year} All Rights Reserved. {company.name}</p>
          <div className="flex items-center gap-6">
            <Link href={routes.privacy} className="hover:text-brand">
              Privacy Policy
            </Link>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
