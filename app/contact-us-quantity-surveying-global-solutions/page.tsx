import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal, Stagger, StaggerLi } from "@/components/ui/Reveal";
import { LocalTime } from "@/components/ui/LocalTime";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from "@/lib/seo";
import { company, offices, routes } from "@/lib/site";

const seo = {
  path: routes.contact,
  title: "Contact Us | Get a Quantity Surveying Quote | QSGS",
  description:
    "Contact Quantity Surveying Global Solutions for a quote on take-offs, BOQ preparation or cost plans. Contacts in the UAE, Kuwait, Australia and Sri Lanka.",
  ogTitle: "Contact | Quantity Surveying Global Solutions",
  ogLabel: "Schedule an online meeting",
};

export const metadata = buildMetadata(seo);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: routes.contact }])} />
      <JsonLd data={webPageJsonLd({ path: routes.contact, name: seo.title, description: seo.description, type: "ContactPage" })} />
      <PageHero
        crumbs={[{ name: "Contact" }]}
        eyebrow="Contact us"
        title={["Contact our quantity surveyors."]}
        lead="Book an online meeting or request a quotation. Tell us about your project and our quantity surveying team will reply by email."
      />

      <section id="form" className="section scroll-mt-24 pt-10 lg:pt-14" aria-label="Contact form and offices">
        <div className="container-x grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
          <Reveal y={24}>
            <div className="rounded-[20px] bg-white p-6 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-8">
              <ContactForm />
            </div>
          </Reveal>

          <div className="space-y-4">
            <Reveal>
              <div className="rounded-[20px] bg-brand p-6 text-white">
                <p className="eyebrow !text-white/70">General enquiries</p>
                <a href={`mailto:${company.email}`} className="t-h4 mt-3 block break-all !text-white hover:underline">
                  {company.email}
                </a>
              </div>
            </Reveal>
            <Stagger as="ul" className="rounded-[20px] bg-paper-2 px-6" gap={0.05}>
              {offices.map((o, i) => (
                <StaggerLi key={o.country} className={i ? "border-t border-line py-5" : "py-5"}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="t-h4">{o.country}</h2>
                    <LocalTime tz={o.timezone} />
                  </div>
                  {o.phone && (
                    <a href={o.phoneHref} className="t-small mt-1.5 block text-ink-2 hover:text-brand">
                      {o.phone}
                    </a>
                  )}
                  <a href={`mailto:${o.email}`} className="t-small mt-0.5 block break-all text-muted hover:text-brand">
                    {o.email}
                  </a>
                </StaggerLi>
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </>
  );
}
