import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { CareersForm } from "@/components/forms/CareersForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerLi } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
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
      <h3 className="eyebrow !text-[0.74rem]">{title}</h3>
      <Stagger as="ul" className="mt-6 border-t border-ink" gap={0.04}>
        {items.map((it) => (
          <StaggerLi key={it} className="flex gap-4 border-b border-line py-5 text-[1.02rem] leading-relaxed text-ink-2">
            <span className="mt-[0.75em] h-px w-4 shrink-0 bg-brand" aria-hidden />
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
        lead="Quantity Surveying Global Solutions (QSGS) is a leading provider of comprehensive quantity surveying services, specializing in various project types, including commercial, residential, mixed-use, and more. Our team is dedicated to delivering accurate, timely, and cost-effective solutions to clients worldwide. We are passionate about innovation, excellence, and sustainability, and we invite you to be part of our journey."
      />

      <section aria-label="Project visuals" className="mt-20">
        <Marquee speed={55}>
          {[...gallery, ...gallery].map((g, i) => (
            <div key={i} className="relative mx-3 h-[240px] w-[200px] shrink-0 overflow-hidden rounded-[6px] sm:h-[340px] sm:w-[280px]">
              <Image src={`/images/projects/${g}.webp`} alt="Project by Quantity Surveying Global Solutions" fill sizes="280px" className="object-cover" />
            </div>
          ))}
        </Marquee>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:py-36" aria-labelledby="job-title">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <SectionHeading id="job-title" eyebrow="Open position" title={[qsJob.title]} size="lg" />
              <Reveal delay={0.1}>
                <dl className="mt-10 border-t border-ink">
                  {[
                    ["Job title", qsJob.title],
                    ["Location", qsJob.location],
                    ["Job type", qsJob.type],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6 border-b border-line py-5">
                      <dt className="text-muted">{k}</dt>
                      <dd className="text-right font-medium text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <h3 className="eyebrow !text-[0.74rem]">Job description</h3>
              <p className="lead mt-6">{qsJob.description}</p>
            </Reveal>
          </div>
          <div className="mt-20 grid gap-16 lg:grid-cols-2 lg:gap-24">
            <List title="Key responsibilities" items={qsJob.responsibilities} />
            <List title="Requirements" items={qsJob.requirements} />
          </div>
        </div>
      </section>

      <section id="apply" className="scroll-mt-28 bg-surface/60 px-5 py-24 sm:px-8 lg:py-36" aria-labelledby="apply-title">
        <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading id="apply-title" eyebrow="Join us today" title={["Apply now."]} lead="Be a part of a forward-thinking company that values excellence, innovation, and collaboration. Apply now and help us shape the future of quantity surveying!" />
            <Reveal delay={0.2}>
              <p className="mt-8 text-[0.95rem] text-muted">
                Questions? Email{" "}
                <a href={`mailto:${company.email}`} className="text-ink underline underline-offset-4">
                  {company.email}
                </a>
              </p>
            </Reveal>
          </div>
          <Reveal y={30}>
            <div className="glass glass-strong p-6 sm:p-10">
              <CareersForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
