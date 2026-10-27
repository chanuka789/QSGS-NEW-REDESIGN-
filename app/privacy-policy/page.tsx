import { PageHero } from "@/components/sections/PageHero";
import { buildMetadata } from "@/lib/seo";
import { company, routes } from "@/lib/site";

export const metadata = buildMetadata({
  path: routes.privacy,
  title: "Privacy Policy | Quantity Surveying Global Solutions",
  description: "How Quantity Surveying Global Solutions handles the personal information you share through our website forms.",
});

const sections = [
  {
    h: "Information we collect",
    p: "When you use our contact or careers forms, we collect the details you choose to provide — such as your name, email address, phone number, company, country, preferred meeting time, message, and (for job applications) your CV, cover letter and address details.",
  },
  {
    h: "How we use it",
    p: "We use this information only to respond to your enquiry, arrange meetings, prepare quotations, and assess job applications. We do not sell your information or use it for unrelated marketing.",
  },
  {
    h: "How it is processed",
    p: "Form submissions are sent by email to our team through Microsoft 365. The website is hosted on Railway. These providers process data on our behalf under their own security and privacy commitments.",
  },
  {
    h: "Cookies",
    p: "This website does not use advertising or tracking cookies. Technical storage may be used only to make the site work correctly.",
  },
  {
    h: "Retention",
    p: "We keep enquiries and applications only for as long as needed for the purpose they were shared for, and then delete them.",
  },
  {
    h: "Your rights",
    p: `You can ask us to access, correct or delete your personal information at any time by emailing ${company.email}.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Privacy Policy" }]} eyebrow="Legal" title={["Privacy policy."]} lead={`Last updated: ${new Date("2026-10-27").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`} size="md" />
      <section className="px-5 pb-28 pt-16 sm:px-8">
        <div className="mx-auto max-w-[1320px]">
          <ol className="max-w-3xl border-t border-ink">
            {sections.map((s, i) => (
              <li key={s.h} className="grid gap-3 border-b border-line py-8 sm:grid-cols-[64px_1fr]">
                <span className="num pt-1">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="text-[1.5rem] font-medium">{s.h}</h2>
                  <p className="mt-3 leading-[1.8] text-muted">{s.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
