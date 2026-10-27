import { HomeHero } from "@/components/sections/home/HomeHero";
import { GlobalReach } from "@/components/sections/home/GlobalReach";
import { WhyChoose } from "@/components/sections/home/WhyChoose";
import { StandardsMarquee } from "@/components/sections/StandardsMarquee";
import { SegmentIndex } from "@/components/sections/SegmentIndex";
import { Stats } from "@/components/sections/Stats";
import { Disciplines } from "@/components/sections/Disciplines";
import { WorkSamples } from "@/components/sections/WorkSamples";
import { ServiceAccordion } from "@/components/sections/ServiceAccordion";
import { Approach } from "@/components/sections/Approach";
import { ProjectsGallery } from "@/components/sections/ProjectsGallery";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";
import { modules } from "@/lib/services";
import { routes } from "@/lib/site";
import Link from "next/link";

const seo = {
  path: "/",
  title: "Quantity Surveying Global Solutions | Expert Taking-Off & BOQ Services",
  description:
    "Your trusted partner for comprehensive quantity surveying services, including precise cost estimation, 2D and 3D take-off services, and detailed BOQ preparation. Specializing in architectural, structural, M&E, plumbing, and infrastructural projects. Enhance your project’s accuracy and efficiency with our global expertise.",
  ogTitle: "Quantity Surveying Global Solutions",
  ogDescription:
    "QS Global Solutions offers remote quantity surveying services with accurate take-offs, BOQ preparation, and cost management — saving you time and resources without the need for on-site presence.",
  twitterTitle: "Home | Quantity Surveying Global Solutions",
  type: "website" as const,
  ogLabel: "Expert Taking-Off & BOQ Services, delivered remotely",
};

export const metadata = buildMetadata(seo);

const homeServices = [
  { module: modules.takeoff, href: routes.consultants, linkLabel: "Discuss take-off quantities" },
  { module: modules.boq, href: routes.developers, linkLabel: "Discuss bills of quantities" },
  { module: modules.tenderDocs, href: routes.developers, linkLabel: "Discuss tender documents" },
  { module: modules.revision, href: routes.architects, linkLabel: "Discuss BoQ revisions" },
  { module: modules.review, href: routes.developers, linkLabel: "Discuss a BoQ review" },
  { module: modules.tenderQueries, href: routes.contractors, linkLabel: "Discuss tender queries" },
  { module: modules.variations, href: routes.contractors, linkLabel: "Discuss variations" },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={webPageJsonLd({ path: "/", name: seo.title, description: seo.description })} />
      <HomeHero />
      <StandardsMarquee />

      {/* Intro statement */}
      <section className="px-5 py-24 sm:px-8 lg:py-36" aria-labelledby="intro-title">
        <div className="mx-auto max-w-[1320px]">
          <p className="eyebrow">About QSGS</p>
          <Reveal>
            <h2 id="intro-title" className="display mt-8 max-w-[22ch] text-[clamp(2rem,4.2vw,3.9rem)] !leading-[1.12]">
              We specialise in providing expert quantity surveying services remotely — to property developers, consultants, contractors and architects around the globe.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href={routes.about} className="link-arrow mt-10 text-[1.05rem]">
              More about us <ArrowLong />
            </Link>
          </Reveal>
          <div className="mt-20">
            <Stats />
          </div>
        </div>
      </section>

      {/* Who we help */}
      <section className="px-5 pb-24 sm:px-8 lg:pb-36" aria-labelledby="services-title">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <SectionHeading id="services-title" eyebrow="Our remote services" title={["We are offering our", "remote services."]} />
            <p className="lead lg:pb-2">Tailored quantity surveying support for every side of the project.</p>
          </div>
          <div className="mt-14">
            <SegmentIndex />
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-surface/60 px-5 py-24 sm:px-8 lg:py-36" aria-labelledby="what-title">
        <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading id="what-title" eyebrow="What we do" title={["Precise quantities,", "from take-off to tender."]} size="md" lead="2D and 3D take-off services along with BoQ preparation for Architectural, Structural, M&E, Infrastructural, Landscape, Irrigation, ICT and Security systems & Data centers." />
            <Reveal delay={0.2}>
              <Link href={routes.services} className="link-arrow mt-10 text-[1.05rem]">
                Find the right support <ArrowLong />
              </Link>
            </Reveal>
          </div>
          <ServiceAccordion items={homeServices} />
        </div>
      </section>

      <Approach />

      {/* Disciplines + work samples */}
      <section className="py-24 lg:py-36" aria-labelledby="disciplines-title">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeading id="disciplines-title" eyebrow="What we measure" title={["Every discipline,", "one standard of care."]} size="md" />
            <Disciplines />
          </div>
        </div>
        <div className="mt-24">
          <WorkSamples />
        </div>
      </section>

      <GlobalReach />
      <ProjectsGallery />
      <WhyChoose />
      <CtaBand />
    </>
  );
}
