import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal, Stagger, StaggerLi } from "@/components/ui/Reveal";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { LocalTime } from "@/components/ui/LocalTime";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from "@/lib/seo";
import { company, offices, routes } from "@/lib/site";

const seo = {
  path: routes.contact,
  title: "Contact Us | Quantity Surveying Global Solutions",
  description:
    "Get in touch with Quantity Surveying Global Solutions for expert quantity surveying services. Reach out for precise cost estimation, 2D/3D take-off services, and BOQ preparation. Our team is ready to assist with your architectural, structural, M&E, plumbing, and infrastructural project needs. Contact us today to ensure your project’s success.",
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
        title={["Schedule a meeting."]}
        lead="Tell us about your project and choose a convenient time. Our quantity surveying team will confirm your online meeting by email."
        size="md"
      />

      <section className="px-5 pb-24 pt-14 sm:px-8 lg:pb-24 lg:pt-20" aria-label="Contact form and offices">
        <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
          <Reveal y={30}>
            <div className="panel p-6 sm:p-10">
              <ContactForm />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="eyebrow">General enquiries</p>
              <a href={`mailto:${company.email}`} className="link-arrow mt-5 text-[1.15rem]">
                {company.email} <ArrowLong />
              </a>
            </Reveal>
            <Stagger as="ul" className="mt-14 border-t border-ink" gap={0.06}>
              {offices.map((o, i) => (
                  <StaggerLi key={o.country} className="grid grid-cols-[44px_1fr] gap-3 border-b border-line py-7">
                    <span className="num pt-1">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="text-[1.5rem] font-medium tracking-[-0.02em]">{o.country}</h2>
                        <LocalTime tz={o.timezone} />
                      </div>
                      {o.phone && (
                        <a href={o.phoneHref} className="mt-2 block text-[1.02rem] text-ink-2 hover:text-brand">
                          {o.phone}
                        </a>
                      )}
                      <a href={`mailto:${o.email}`} className="mt-1 block break-all text-[0.98rem] text-muted hover:text-brand">
                        {o.email}
                      </a>
                    </div>
                  </StaggerLi>
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </>
  );
}
