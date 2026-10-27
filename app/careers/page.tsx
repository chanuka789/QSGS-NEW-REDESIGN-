import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { CareersForm } from "@/components/forms/CareersForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerLi } from "@/components/ui/Reveal";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, jobPostingJsonLd } from "@/lib/seo";
import { qsJob } from "@/lib/jobs";
import { company, routes } from "@/lib/site";

const seo = {
  path: routes.careers,
  title: "Remote Quantity Surveyor Jobs | Join Our Global Team at Quantity Surveying Global Solutions",
  description:
    "Apply now for remote Quantity Surveyor positions at Quantity Surveying Global Solutions. Work on diverse projects worldwide, enjoy flexible hours, and grow your career with our innovative team. Explore exciting job opportunities and contribute to cutting-edge projects in commercial, residential, and mixed-use sectors.",
  ogTitle: "Careers | Quantity Surveying Global Solutions",
  ogLabel: "Careers — Remote Quantity Surveyor jobs",
};

export const metadata = buildMetadata(seo);

const gallery = ["hotel-tower", "hillside-housing", "wave-residences", "office-tower", "corporate-hq"];

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="t-h3">{title}</h3>
      <Stagger as="ul" className="mt-5 border-t border-line" gap={0.03}>
        {items.map((it) => (
          <StaggerLi key={it} className="t-body flex gap-3 border-b border-line py-3.5 !text-ink-2">
            <span className="mt-[0.75em] h-px w-3 shrink-0 bg-brand" aria-hidden />
            {it}
          </StaggerLi>
        ))}
      </Stagger>
    </div>
  );
}

export default function CareersPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Careers", path: routes.careers }])} />
      <JsonLd
        data={jobPostingJsonLd({
          title: qsJob.title,
          description: `<p>${qsJob.description}</p><h3>Key Responsibilities</h3><ul>${qsJob.responsibilities.map((r) => `<li>${r}</li>`).join("")}</ul><h3>Requirements</h3><ul>${qsJob.requirements.map((r) => `<li>${r}</li>`).join("")}</ul>`,
          datePosted: qsJob.datePosted,
          employmentType: qsJob.employmentType,
        })}
      />
      <PageHero
        crumbs={[{ name: "Careers" }]}
        eyebrow="Careers"
        title={["Shape the future of quantity surveying."]}
        lead="Quantity Surveying Global Solutions (QSGS) is a leading provider of comprehensive quantity surveying services, specializing in various project types, including commercial, residential, mixed-use, and more. We are passionate about innovation, excellence, and sustainability, and we invite you to be part of our journey."
      >
        <Reveal delay={0.3}>
          <a href="#apply" className="btn btn-primary mt-8">
            Apply now <ArrowUpRight className="h-4 w-4" />
          </a>
        </Reveal>
      </PageHero>

      <section aria-label="Project visuals" className="container-x mt-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {gallery.slice(0, 4).map((g, i) => (
            <Reveal key={g} delay={i * 0.06} className="relative aspect-[3/4] overflow-hidden rounded-[16px] bg-paper-2">
              <Image src={`/images/projects/${g}.webp`} alt="Project by Quantity Surveying Global Solutions" fill sizes="(min-width:640px) 25vw, 50vw" className="object-cover" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="job-title">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <SectionHeading id="job-title" eyebrow="Open position" title={[qsJob.title]} />
              <Reveal delay={0.1}>
                <dl className="t-small mt-8 rounded-[16px] bg-paper-2 px-5">
                  {[
                    ["Job title", qsJob.title],
                    ["Location", qsJob.location],
                    ["Job type", qsJob.type],
                  ].map(([k, v], i) => (
                    <div key={k} className={`flex justify-between gap-6 py-4 ${i ? "border-t border-line" : ""}`}>
                      <dt className="text-muted">{k}</dt>
                      <dd className="text-right font-medium text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
            <Reveal delay={0.1} className="lg:pt-10">
              <h3 className="t-h3">Job description</h3>
              <p className="t-lead mt-4">{qsJob.description}</p>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <List title="Key responsibilities" items={qsJob.responsibilities} />
            <List title="Requirements" items={qsJob.requirements} />
          </div>
        </div>
      </section>

      <section id="apply" className="section scroll-mt-24 bg-brand-50/60" aria-labelledby="apply-title">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading id="apply-title" eyebrow="Join us today" title={["Apply now."]} lead="Be a part of a forward-thinking company that values excellence, innovation, and collaboration. Apply now and help us shape the future of quantity surveying!" />
            <Reveal delay={0.15}>
              <p className="t-small mt-6 text-muted">
                Questions? Email{" "}
                <a href={`mailto:${company.email}`} className="text-brand underline underline-offset-4">
                  {company.email}
                </a>
              </p>
            </Reveal>
          </div>
          <Reveal y={24}>
            <div className="rounded-[20px] bg-white p-6 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-8">
              <CareersForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
