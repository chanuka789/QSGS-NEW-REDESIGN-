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
  title: "Quantity Surveying Company | BOQ & Take-Off Services | QSGS",
  description:
    "Quantity surveying company for the UAE, Qatar, Saudi Arabia, Kuwait and Australia: BOQ preparation, quantity take-offs, cost plans and tender documents.",
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

      {/* About + stats */}
      <section className="section" aria-labelledby="intro-title">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <SectionHeading id="intro-title" eyebrow="About QSGS" title={["Expert quantity surveying, delivered remotely."]} />
            <Reveal delay={0.1} className="lg:pt-10">
              <p className="t-lead">
                We specialise in providing expert quantity surveying services remotely to clients around the globe — property developers, consultant firms, contracting firms and independent architects.
              </p>
              <Link href={routes.about} className="link-arrow mt-6">
                More about us <ArrowLong />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14">
            <Stats />
          </div>
        </div>
      </section>

      {/* Who we help */}
      <section className="section pt-0 lg:pt-0" aria-labelledby="services-title">
        <div className="container-x">
          <SectionHeading id="services-title" eyebrow="Our remote services" title={["We are offering our remote services."]} lead="Tailored quantity surveying support for every side of the project." />
          <div className="mt-10">
            <SegmentIndex />
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="section bg-brand-50/60" aria-labelledby="what-title">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="what-title"
              eyebrow="What we do"
              title={["Precise quantities, from take-off to tender."]}
              lead="2D and 3D take-off services along with BoQ preparation for Architectural, Structural, M&E, Infrastructural, Landscape, Irrigation, ICT and Security systems & Data centers."
            />
            <Reveal delay={0.15}>
              <Link href={routes.services} className="link-arrow mt-8">
                Find the right support <ArrowLong />
              </Link>
            </Reveal>
          </div>
          <ServiceAccordion items={homeServices} />
        </div>
      </section>

      <Approach />

      {/* Disciplines + work samples */}
      <section className="section" aria-labelledby="disciplines-title">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading id="disciplines-title" eyebrow="What we measure" title={["Every discipline, one standard of care."]} lead="Residential, commercial, hospitality, civic and infrastructure projects." />
          <Disciplines />
        </div>
        <div className="mt-14">
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
