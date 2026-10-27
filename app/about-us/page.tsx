import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { SegmentIndex } from "@/components/sections/SegmentIndex";
import { ProjectsGallery } from "@/components/sections/ProjectsGallery";
import { Stats } from "@/components/sections/Stats";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/Parallax";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from "@/lib/seo";
import { routes } from "@/lib/site";

const seo = {
  path: routes.about,
  title: "About Us | Quantity Surveying Global Solutions",
  description:
    "Quantity Surveying Global Solutions offers expert cost estimation, 2D and 3D take-off services, and detailed BOQ preparation. Specializing in architectural, structural, M&E, plumbing, and infrastructural projects, we ensure accuracy and efficiency for global clients.",
  ogTitle: "About us | Quantity Surveying Global Solutions",
};

export const metadata = buildMetadata(seo);

const story = [
  {
    k: "Origins",
    h: "Born from a vision to simplify quantity surveying.",
    p: [
      "In a world where construction projects are becoming increasingly complex, Quantity Surveying Global Solutions was born out of a vision to simplify and enhance the art of quantity surveying. Our journey began with a team of passionate quantity surveyors who believed in the power of precision, efficiency, and innovation.",
      "Our founders, seasoned professionals in the construction industry, recognized the growing demand for reliable and accurate surveying services that could transcend geographical boundaries. With a blend of expertise and cutting-edge tools, we developed a suite of remote services designed to meet the diverse needs of property developers, consultant firms, contracting firms, and independent architects.",
    ],
    img: "/images/photos/drawings.webp",
  },
  {
    k: "Ambition",
    h: "Redefining the standards of quantity surveying.",
    p: [
      "From our humble beginnings, we set out to redefine the standards of quantity surveying, driven by the desire to offer unparalleled remote services to clients worldwide. We envisioned a future where advanced technology and expert knowledge could be seamlessly integrated to provide cost-effective and efficient solutions for any project, anywhere.",
      "At Quantity Surveying Global Solutions, we pride ourselves on our commitment to excellence. Our team works meticulously on every detail of a project. We believe in the power of collaboration, leveraging our collective experience to deliver results that exceed expectations.",
    ],
    img: "/images/photos/collaboration.webp",
  },
  {
    k: "Innovation",
    h: "Technology at the heart of everything we deliver.",
    p: [
      "Innovation is at the heart of our operations. By embracing the latest technology, we offer precise take-offs, detailed BOQ preparation, and comprehensive cost management services, all from a remote setting. This not only saves our clients valuable time and resources but also ensures that projects are managed with the utmost accuracy and professionalism.",
    ],
    img: "/images/work/takeoff-3d-model.webp",
  },
  {
    k: "Growth",
    h: "Continuous growth, steadfast mission.",
    p: [
      "Our journey has been marked by continuous growth and adaptation. As we expanded our services globally, we remained steadfast in our mission to provide top-notch quantity surveying solutions tailored to the unique requirements of each client. Today, we are proud to serve a diverse portfolio of projects, ranging from commercial, residential, mixed-use, hotels, healthcare, educational, sports, recreational, industrial, irrigation, expressways, and infrastructure developments.",
      "Our story is one of dedication, innovation, and a relentless pursuit of excellence. We are Quantity Surveying Global Solutions, your trusted partner in turning visions into reality, one project at a time. Join us on our journey, and let us help you build the future with confidence and precision.",
    ],
    img: "/images/projects/waterfront-skyline.webp",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "About us", path: routes.about }])} />
      <JsonLd data={webPageJsonLd({ path: routes.about, name: seo.title, description: seo.description, type: "AboutPage" })} />
      <PageHero
        crumbs={[{ name: "About us" }]}
        eyebrow="About us"
        title={["Precision without borders."]}
        lead="Welcome to Quantity Surveying Global Solutions! We specialize in providing expert quantity surveying services remotely to clients around the globe. Our team of seasoned professionals utilizes the latest technology to deliver accurate cost estimates, detailed BOQ preparation, and efficient project management."
        image="/images/photos/glass-towers.webp"
        imageAlt="Modern glass towers — Quantity Surveying Global Solutions"
      />

      <section className="section" aria-labelledby="redefine-title">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <SectionHeading id="redefine-title" eyebrow="Who we are" title={["Redefining precision and efficiency in quantity surveying."]} />
            <Reveal delay={0.1} className="lg:pt-10">
              <p className="t-lead">
                At Quantity Surveying Global Solutions, we specialize in delivering top-tier remote quantity surveying services across the globe. Our team of experienced professionals combines advanced technology with industry expertise to provide precise cost management, detailed BOQ preparation, and accurate take-offs. We cater to property developers, consultant firms, contracting firms, and independent architects, ensuring every project is managed with excellence and efficiency.
              </p>
              <Link href={routes.services} className="link-arrow mt-6">
                Our services <ArrowLong />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats on brand */}
      <section className="section bg-brand" aria-label="QSGS in numbers">
        <div className="container-x">
          <Stats invert />
        </div>
      </section>

      {/* Our story */}
      <section className="section" aria-labelledby="story-title">
        <div className="container-x">
          <SectionHeading id="story-title" eyebrow="Our story" title={["One project at a time, around the world."]} />
          <div className="mt-12 space-y-16 lg:space-y-24">
            {story.map((c, i) => (
              <article key={c.k} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <Reveal className={i % 2 ? "lg:order-2" : ""}>
                  <p className="eyebrow">
                    {String(i + 1).padStart(2, "0")} · {c.k}
                  </p>
                  <h3 className="t-h3 mt-3">{c.h}</h3>
                  {c.p.map((tx) => (
                    <p key={tx.slice(0, 20)} className="t-body mt-4">
                      {tx}
                    </p>
                  ))}
                </Reveal>
                <Reveal y={30} className={i % 2 ? "lg:order-1" : ""}>
                  <ParallaxImage src={c.img} alt={c.h} className="aspect-[4/3] rounded-[16px]" sizes="(min-width:1024px) 560px, 100vw" strength={6} />
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-paper-2" aria-labelledby="clients-title">
        <div className="container-x">
          <SectionHeading id="clients-title" eyebrow="Who we serve" title={["Property developers, consultants, contractors and architects."]} />
          <div className="mt-10">
            <SegmentIndex />
          </div>
        </div>
      </section>

      <ProjectsGallery />
      <CtaBand />
    </>
  );
}
