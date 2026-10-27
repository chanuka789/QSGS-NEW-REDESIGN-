import { PageHero } from "@/components/sections/PageHero";
import { SegmentIndex } from "@/components/sections/SegmentIndex";
import { ServiceTimeline } from "@/components/sections/ServiceTimeline";
import { Disciplines } from "@/components/sections/Disciplines";
import { StandardsMarquee } from "@/components/sections/StandardsMarquee";
import { Approach } from "@/components/sections/Approach";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";
import { modules } from "@/lib/services";
import { routes } from "@/lib/site";

const seo = {
  path: routes.services,
  title: "Our Services | Quantity Surveying Global Solutions",
  description:
    "Discover the comprehensive services offered by Quantity Surveying Global Solutions. From precise cost estimation and 2D/3D take-off services to detailed BOQ preparation, we specialize in architectural, structural, M&E, plumbing, and infrastructural projects. Ensure your project’s success with our expert quantity surveying services.",
  ogTitle: "Our services | Quantity Surveying Global Solutions",
};

export const metadata = buildMetadata(seo);

const all = [modules.takeoff, modules.boq, modules.tenderDocs, modules.revision, modules.review, modules.verification, modules.tenderQueries, modules.variations];

export default function OurServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Our Services", path: routes.services }])} />
      <JsonLd
        data={serviceJsonLd({
          path: routes.services,
          name: "Remote Quantity Surveying Services",
          description: seo.description,
          audience: "Property developers, cost consultants, contractors and architects",
          services: all.map((m) => ({ name: m.title, description: m.intro })),
        })}
      />
      <PageHero
        crumbs={[{ name: "Our Services" }]}
        eyebrow="Our services"
        title={["We are offering our remote services."]}
        lead="Take-offs, Bills of Quantities, tender documents, revisions and reviews — delivered remotely by graduate quantity surveyors to clients in 20+ countries."
      />

      <section className="section pt-12 lg:pt-16" aria-label="Services by client">
        <div className="container-x">
          <SegmentIndex />
        </div>
      </section>

      <StandardsMarquee />

      <section className="section" aria-labelledby="scope-title">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            id="scope-title"
            eyebrow="Scope"
            title={["2D and 3D take-offs with BoQ preparation."]}
            lead="For Architectural, Structural, Mechanical, Electrical (M&E) & Plumbing, Infrastructural, Landscape, Irrigation, ICT and Security systems & Data centers."
          />
          <Disciplines />
        </div>
      </section>

      <section className="section border-t border-line" aria-labelledby="all-title">
        <div className="container-x mb-12">
          <SectionHeading id="all-title" eyebrow="Service catalogue" title={["Every service, step by step."]} />
        </div>
        <ServiceTimeline modules={all} />
      </section>

      <Approach />
      <div className="pt-16 lg:pt-24">
        <CtaBand />
      </div>
    </>
  );
}
