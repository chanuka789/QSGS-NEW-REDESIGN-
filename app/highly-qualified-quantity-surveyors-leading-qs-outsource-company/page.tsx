import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { Reveal, Stagger, StaggerLi } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from "@/lib/seo";
import { routes } from "@/lib/site";

const seo = {
  path: routes.team,
  title: "Highly Qualified Quantity Surveyors | Leading QS Outsource Company",
  description:
    "Discover top-tier quantity surveying services from a leading QS outsource company. Our team of highly qualified quantity surveyors brings extensive expertise in cost management, budgeting, and contract administration, ensuring your projects are delivered on time and within budget. Trust us for precision, accuracy, and exceptional results in every project.",
  ogTitle: "Meet Our Expert Team | Quantity Surveying Global Solutions",
};

export const metadata = buildMetadata(seo);

const pillars = [
  {
    t: "Global Experience",
    d: "Our quantity surveyors bring extensive practical experience gained from working on diverse projects across mostly the Gulf region, the United Kingdom, Australia, and New Zealand. This global exposure has equipped our team with a deep understanding of various construction practices, regulations, and market dynamics. Whether managing large-scale commercial buildings, mixed-use residential developments, infrastructure projects, hotel construction, specialized irrigation systems, data centers, or expressway and road developments, our surveyors apply their international experience to deliver precise and reliable quantity surveying services. Each project is tailored to the specific needs of its region, ensuring that our clients receive the highest standards of accuracy and efficiency.",
  },
  {
    t: "Academic Excellence",
    d: "At Quantity Surveying Global Solutions, our team is distinguished by their strong academic foundation in quantity surveying. Every member of our team holds a bachelor degree in this specialized field, ensuring they possess the critical knowledge and skills required to excel in construction economics, cost management, and contract administration. This academic expertise is continually reinforced through ongoing professional development, keeping our surveyors at the forefront of industry standards, methodologies, and tools.",
  },
  {
    t: "Diverse Project Expertise",
    d: "Our team’s experience spans a wide range of sectors, including commercial, residential, infrastructure, and more. This diverse project expertise enables us to handle any project, regardless of size or complexity, ensuring that our clients receive tailored solutions that meet their specific needs.",
  },
  {
    t: "Commitment to Client Success",
    d: "We are dedicated to supporting our clients through every phase of their projects. From initial cost estimation and tender preparation to contract management and final accounts, our team works closely with clients to ensure that their projects are completed on time, within budget, and to the highest standards of quality.",
  },
  {
    t: "Continuous Learning and Innovation",
    d: "Our team is committed to continuous learning and staying ahead of industry trends. By keeping up-to-date with the latest technologies, best practices, and market developments, our surveyors ensure that they deliver innovative and effective solutions to meet the evolving needs of our clients.",
  },
  {
    t: "Your Trusted Partner in Quantity Surveying",
    d: "Our team of graduated quantity surveyors, with their extensive experience in the Gulf region, is uniquely positioned to provide expert guidance and support for your projects. Their dedication to excellence and deep regional knowledge make Quantity Surveying Global Solutions your trusted partner for all your quantity surveying needs.",
  },
];

const regions = ["Gulf region", "United Kingdom", "Australia", "New Zealand"];

export default function TeamPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "About us", path: routes.about }, { name: "Our Team", path: routes.team }])} />
      <JsonLd data={webPageJsonLd({ path: routes.team, name: seo.title, description: seo.description })} />
      <PageHero
        crumbs={[{ name: "About us", href: routes.about }, { name: "Our Team" }]}
        eyebrow="Highly qualified quantity surveyors"
        title={["Meet our expert team."]}
        lead="Graduate quantity surveyors with hands-on experience across the Gulf region, the United Kingdom, Australia and New Zealand — a leading QS outsource partner for your projects."
        image="/images/photos/team.webp"
        imageAlt="Quantity surveying team collaborating"
      />

      <section aria-label="Regions of experience" className="mt-20 border-y border-line py-6">
        <Marquee speed={40}>
          {[...regions, ...regions].map((r, i) => (
            <span key={i} className="mx-10 inline-flex items-center gap-10 whitespace-nowrap text-[clamp(1.6rem,3vw,2.6rem)] font-medium tracking-[-0.02em] text-ink/75">
              {r}
              <span className="h-2 w-2 rounded-full bg-brand/60" aria-hidden />
            </span>
          ))}
        </Marquee>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-24" aria-labelledby="pillars-title">
        <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading id="pillars-title" eyebrow="What sets us apart" title={["Six reasons clients", "trust our team."]} size="md" />
            <Reveal delay={0.2}>
              <Link href={routes.careers} className="link-arrow mt-10 text-[1.05rem]">
                Join our team <ArrowLong />
              </Link>
            </Reveal>
          </div>
          <Stagger as="ol" className="border-t border-ink" gap={0.06}>
            {pillars.map((p, i) => (
                <StaggerLi key={p.t} className="grid gap-4 border-b border-line py-10 sm:grid-cols-[64px_1fr]">
                  <span className="num pt-2">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-[clamp(1.5rem,2.6vw,2.2rem)] font-medium leading-tight">{p.t}</h3>
                    <p className="mt-4 text-[1.02rem] leading-[1.8] text-muted">{p.d}</p>
                  </div>
                </StaggerLi>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand title="Work with graduate quantity surveyors." />
    </>
  );
}
