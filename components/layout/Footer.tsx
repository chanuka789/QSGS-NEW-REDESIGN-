import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { company, offices, routes } from "@/lib/site";
import { BackToTop } from "./BackToTop";

const links = [
  { label: "About us", href: routes.about },
  { label: "Our Team", href: routes.team },
  { label: "Services", href: routes.services },
  { label: "Careers", href: routes.careers },
  { label: "Contact", href: routes.contact },
];

/** Compact footer: logo, quick links and office contacts on a few short rows. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line py-10">
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" aria-label={`${company.name} — home`} className="shrink-0">
            <Logo className="h-9 w-auto text-brand" />
          </Link>
          <nav aria-label="Footer">
            <ul className="t-small flex flex-wrap gap-x-6 gap-y-2 text-ink-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <ul className="t-xs mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 sm:grid-cols-3 lg:grid-cols-5">
          <li>
            <p className="font-medium text-ink">Email</p>
            <a href={`mailto:${company.email}`} className="mt-1 block break-all text-muted hover:text-brand">
              {company.email}
            </a>
          </li>
          {offices.map((o) => (
            <li key={o.country}>
              <p className="font-medium text-ink">{o.country}</p>
              {o.phone ? (
                <a href={o.phoneHref} className="mt-1 block text-muted hover:text-brand">
                  {o.phone}
                </a>
              ) : (
                <a href={`mailto:${o.email}`} className="mt-1 block break-all text-muted hover:text-brand">
                  {o.email}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="t-xs mt-6 flex flex-col gap-3 border-t border-line pt-5 text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {company.name}. All rights reserved.</p>
          <div className="flex items-center gap-5">
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
